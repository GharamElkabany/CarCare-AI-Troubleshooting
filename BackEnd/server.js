import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const salt = 10;

const app = express();

app.use(express.json());//passing json data from incoming http requests
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["POST", "GET", "PUT", "DELETE"],
    credentials: true
})); //address security consern
app.use(cookieParser());

const port = 5000

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "carcare"
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "You are not authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err,decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"});
            } else {
                req.name = decoded.name;
                next();
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success", name:req.name});
})

app.post('/register', (req, res)=>{
    const sql = 'INSERT INTO login (`name`,`email`,`phone`,`password`) VALUES (?)';
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) =>{
        if(err) return res.json({Error: "Error for hashing password"});
        const values = [
            req.body.name,
            req.body.email,
            req.body.phone,
            hash
        ];
        db.query(sql, [values], (err, result) =>{
            if(err) return res.json({Error: "Inserting data Error in server"});
            return res.json({Status: "Success"});
        })
    });
    
})

app.post('/login', (req, res)=>{
    const sql = 'SELECT * FROM login WHERE  email = ? OR phone = ?';
    db.query(sql, [req.body.email || req.body.phone, req.body.email || req.body.phone], (err, data) =>{
        if(err) return res.json({Error: "Login error in server"});
        if(data.length > 0){
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if(err)return res.json({Error: "Password compare error"});
                if(response) {
                    const { name, role } = data[0];
                    const token = jwt.sign({ name, role }, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({Status: "Success", role});
                } else {
                    return res.json({Error: "Password not matched"});
                }
            })
        } else {
            return res.json({Error: "No account found with the provided email or phone number"});
        }
    })
})

app.get('/logout', (req, res)=> {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.get('/user/profile', verifyUser, (req, res) => {
    const sql = 'SELECT name, email, phone FROM login WHERE name = ?';
    db.query(sql, [req.name], (err, data) => {
        if (err) {
            return res.json({ Error: "Error fetching user data" });
        }
        if (data.length > 0) {
            return res.json(data[0]); // Send user data
        } else {
            return res.json({ Error: "User not found" });
        }
    });
});

app.put('/user/profile', verifyUser, (req, res) => {
    const { name, email, phone } = req.body;

    const sql = 'UPDATE login SET name = ?, email = ?, phone = ? WHERE name = ?';
    db.query(sql, [name, email, phone, req.name], (err, result) => {
        if (err) {
            return res.json({ Error: "Error updating user data" });
        }
        return res.json({ Status: "Profile updated successfully" });
    });
});

app.put('/user/change-password', verifyUser, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const sqlGetPassword = 'SELECT password FROM login WHERE name = ?';
    const sqlUpdatePassword = 'UPDATE login SET password = ? WHERE name = ?';

    // Fetch the current password from the database
    db.query(sqlGetPassword, [req.name], (err, data) => {
        if (err) {
            return res.json({ Error: "Error fetching user password" });
        }

        if (data.length > 0) {
            // Compare the provided current password with the stored password
            bcrypt.compare(currentPassword, data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password comparison error" });
                if (response) {
                    // Hash the new password
                    bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
                        if (err) return res.json({ Error: "Error hashing new password" });

                        // Update the password in the database
                        db.query(sqlUpdatePassword, [hashedPassword, req.name], (err, result) => {
                            if (err) return res.json({ Error: "Error updating password" });
                            return res.json({ Status: "Password updated successfully" });
                        });
                    });
                } else {
                    return res.json({ Error: "Current password is incorrect" });
                }
            });
        } else {
            return res.json({ Error: "User not found" });
        }
    });
});


app.listen(port, ()=>{
    console.log('listening')
})