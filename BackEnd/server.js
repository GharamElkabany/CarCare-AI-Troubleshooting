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
    methods:["POST", "GET"],
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
    const sql = 'SELECT * FROM login WHERE  email = ?';
    db.query(sql, [req.body.email], (err, data) =>{
        if(err) return res.json({Error: "Login error in server"});
        if(data.length > 0){
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if(err)return res.json({Error: "Password compare error"});
                if(response) {
                    const name = data[0].name;
                    const token = jwt.sign({name}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({Status: "Success"});
                } else {
                    return res.json({Error: "Password not matched"});
                }
            })
        } else {
            return res.json({Error: "No email existed"});
        }
    })
})

app.get('/logout', (req, res)=> {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})


app.listen(port, ()=>{
    console.log('listening')
})