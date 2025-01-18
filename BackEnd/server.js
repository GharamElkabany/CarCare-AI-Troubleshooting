import express from "express";
import mysql from "mysql";
import cors from "cors";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const salt = 10;

const app = express();

app.use(express.json()); //passing json data from incoming http requests
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
); //address security consern
app.use(cookieParser());

const port = 5000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carcare",
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
      user: 'gharam2001255@gmail.com',
      pass: 'gcfavlnibrgmfjfa',
  },
  debug: true,
  logger: true,
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okay" });
      } else {
        console.log("Decoded Token:", decoded);
        req.name = decoded.name;
        req.email = decoded.email;
        req.role = decoded.role;
        req.user_id = decoded.id;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", Name: req.name, Role: req.role });
});

app.post('/register', (req, res) => {
  const sql = "INSERT INTO login (`name`,`email`,`phone`,`password`,`verificationToken`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      if (err) return res.json({ Error: "Error hashing password" });
      const verificationToken = jwt.sign({ email: req.body.email }, "jwt-secret-key", { expiresIn: "1d" });
      const values = [req.body.name, req.body.email, req.body.phone, hash, verificationToken];
      db.query(sql, [values], (err, result) => {
          if (err) return res.json({ Error: "Error inserting data into database" });

          // Send verification email
          const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
          const mailOptions = {
              from: 'gharam2001255@gmail.com',
              to: req.body.email,
              subject: 'Verify Your Email',
              html: `<p>Click the link below to verify your email:</p>
                     <a href="${verificationLink}">${verificationLink}</a>`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.json({ Error: "Error sending verification email" });
            }
            res.json({ Status: "Success", Message: "Verification email sent. Please check your inbox." });
          });
      });
  });
});

app.get('/verify-email', (req, res) => {
  const token = req.query.token;
  if (!token) return res.json({ Error: "Missing token" });

  jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json({ Error: "Invalid or expired token" });

      const sql = "UPDATE login SET isVerified = TRUE WHERE email = ?";
      db.query(sql, [decoded.email], (err, result) => {
          if (err) return res.json({ Error: "Error updating verification status" });

          if (result.affectedRows > 0) {
              res.json({ Status: "Success", Message: "Email verified successfully!" });
          } else {
              res.json({ Error: "User not found" });
          }
      });
  });
});

app.post('/check-email', (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM login WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      res.status(500).json({ Status: 'Error', Error: 'Database error' });
    } else if (result.length > 0) {
      res.status(200).json({ Status: 'Fail', Error: 'Email already exists' });
    } else {
      res.status(200).json({ Status: 'Success' });
    }
  });
});

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ? OR phone = ?";
  db.query(sql, [req.body.email || req.body.phone, req.body.email || req.body.phone], (err, data) => {
      if (err) return res.json({ Error: "Login error in server" });

      if (data.length > 0) {
          if (!data[0].isVerified) {
              return res.json({ Error: "Please verify your email before logging in" });
          }

          bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
              if (err) return res.json({ Error: "Password compare error" });
              if (response) {
                  const { id, name, role } = data[0];
                  const token = jwt.sign({ id, name, role }, "jwt-secret-key", { expiresIn: "1d" });
                  res.cookie("token", token);
                  return res.json({ Status: "Success", role });
              } else {
                  return res.json({ Error: "Something went wrong, Please try again later" });
              }
          });
      } else {
          return res.json({ Error: "No account found with the provided email or phone number" });
      }
  });
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const sql = "SELECT id FROM login WHERE email = ?";
  
  db.query(sql, [email], (err, result) => {
    if (err) return res.json({ Error: "Database error" });
    
    if (result.length === 0) {
      return res.json({ Error: "Email not found" });
    }
    
    const userId = result[0].id;
    const resetToken = jwt.sign({ userId }, "jwt-secret-key", { expiresIn: "1h" }); // Token valid for 1 hour
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a><p>This link will expire in 1 hour.</p>`,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.json({ Error: "Error sending password reset email" });
      }
      res.json({ Status: "Success", Message: "Password reset link sent to your email" });
    });
  });
});

app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  jwt.verify(token, "jwt-secret-key", (err, decoded) => {
    if (err) {
      return res.json({ Error: "Invalid or expired token" });
    }
    
    const userId = decoded.userId;
    bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
      if (err) return res.json({ Error: "Error hashing password" });
      
      const sql = "UPDATE login SET password = ? WHERE id = ?";
      db.query(sql, [hashedPassword, userId], (err, result) => {
        if (err) return res.json({ Error: "Error updating password" });
        res.json({ Status: "Success", Message: "Password updated successfully" });
      });
    });
  });
});

app.get("/users", verifyUser, (req, res) => {
  const sql =
    'SELECT id, name, email, phone, role, isVerified FROM login';
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database Error:", err);
      return res.json({ Error: "Error fetching users" });
    }
    console.log("Fetched Users:", data);
    return res.json(data); // Send all user data
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.get("/user/profile", verifyUser, (req, res) => {
  const sql = "SELECT name, email, phone FROM login WHERE name = ?";
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

app.put("/user/profile", verifyUser, (req, res) => {
  console.log('Received data:', req.body);
  const { name, phone } = req.body;
  // Make sure both name and phone exist in the request body before proceeding
  if (!name || !phone) {
    return res.json({ Error: "Name and phone are required fields" });
  }

  const sql = "UPDATE login SET name = ?, phone = ? WHERE id = ?";
  console.log("Id to update:", req.user_id);
  db.query(sql, [name, phone, req.user_id], (err, result) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.json({ Error: "Error updating user data" });
    }
    if (result.changedRows > 0) {
      console.log("Update result:", result);
      return res.json({ Status: "Profile updated successfully" });
    }else{
      return res.json({ Error: "No changes made or user not found" });
    }  
  });
});

app.post("/user/validate-password", verifyUser, (req, res) => {
  const { currentPassword } = req.body;
  
  const sql = "SELECT password FROM login WHERE id = ?";
  db.query(sql, [req.user_id], (err, data) => {
    if (err) {
      console.error("Error fetching password:", err);
      return res.json({ Error: "Database error" });
    }

    if (data.length > 0) {
      // Compare the current password with the stored password
      bcrypt.compare(currentPassword, data[0].password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.json({ Error: "Error comparing passwords" });
        }

        if (result) {
          return res.json({ Status: "Current password is correct" });
        } else {
          return res.json({ Status: "Invalid password" });
        }
      });
    } else {
      return res.json({ Error: "User not found" });
    }
  });
});

app.put("/user/change-password", verifyUser, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const sqlGetPassword = "SELECT password FROM login WHERE id = ?";
  const sqlUpdatePassword = "UPDATE login SET password = ? WHERE id = ?";

  // Fetch the current password from the database
  db.query(sqlGetPassword, [req.user_id], (err, data) => {
    if (err) {
      return res.json({ Error: "Error fetching user password" });
    }

    if (data.length > 0) {
      bcrypt.compare(currentPassword, data[0].password, (err, response) => {
        if (err) return res.json({ Error: "Password comparison error" });
        if (response) {
          // Hash the new password
          bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
            if (err) return res.json({ Error: "Error hashing new password" });

            // Update the password in the database
            db.query(sqlUpdatePassword, [hashedPassword, req.user_id], (err, result) => {
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

//Admin search user 
app.get("/users/search", verifyUser, (req, res) => {
  const search = req.query.q || "";
  const sql = `
    SELECT id, name, email, phone, role, isVerified 
    FROM login 
    WHERE (name LIKE ? OR email LIKE ? OR phone LIKE ?)
  `;
  const searchValue = `%${search}%`;
  db.query(sql, [searchValue, searchValue, searchValue], (err, data) => {
    if (err) {
      return res.json({ Error: "Error searching users" });
    }
    return res.json(data);
  });
});

//Admin edit user 
app.put("/users/:id", verifyUser, (req, res) => {
  console.log("Request body received:", req.body);
  const { id } = req.params;
  const { name, phone, role, is_verified } = req.body;

  const verifiedValue = is_verified === "1" ? 1 : 0;
  console.log("Verified value:", verifiedValue);

  const sql = "UPDATE login SET name = ?, phone = ?, role = ?, isVerified = ? WHERE id = ?";
  db.query(sql, [name, phone, role, verifiedValue, id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.json({ Error: "Error updating user" });
    }
    if (result.affectedRows > 0) {
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Error: "User not found or no changes made" });
    }
  });
});

//Admin delete user 
app.delete("/users/:id", verifyUser, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM login WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({ Error: "Error deleting user" });
    }
    if (result.affectedRows > 0) {
      return res.json({ Status: "Success", Message: "User deleted successfully" });
    } else {
      return res.json({ Error: "User not found" });
    }
  });
});

app.post("/feedback", verifyUser, (req, res) => {
  const sql =
    "INSERT INTO feedback (user_id, rating, feedback) VALUES (?, ?, ?)";
  const values = [req.user_id, req.body.rating, req.body.feedback];
  console.log(req.user_id);
  console.log("SQL Query: ", sql, values);
  db.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: "Error saving feedback" });
    return res.json({ Status: "Feedback saved successfully" });
  });
});

app.get("/feedbacks", verifyUser, (req, res) => {
  if (req.role !== "admin") return res.json({ Error: "Unauthorized access" });

  const sql = `SELECT f.id, l.name AS name, f.rating, f.feedback, f.timestamp 
                 FROM feedback f
                 JOIN login l ON f.user_id = l.id
                 ORDER BY f.timestamp DESC`;
  db.query(sql, (err, data) => {
    if (err) return res.json({ Error: "Error fetching feedbacks" });
    return res.json(data);
  });
});

app.get("/feedback/ratings", (req, res) => {
  const sql = `SELECT rating, COUNT(*) AS count FROM feedback GROUP BY rating ORDER BY rating`;
  db.query(sql, (err, data) => {
    if (err) return res.json({ Error: "Error fetching rating distribution" });
    return res.json(data);
  });
});

app.get("/stats/feedback-vs-registration", verifyUser, (req, res) => {
  if (req.role !== "admin") return res.json({ Error: "Unauthorized access" });
  const sql = `
        SELECT 
            DATE_FORMAT(f.timestamp, '%Y-%m') AS month,
            COUNT(DISTINCT f.id) AS feedback_count,
            COUNT(DISTINCT l.id) AS registration_count
        FROM 
            feedback f
        LEFT JOIN 
            login l ON YEAR(f.timestamp) = YEAR(CURRENT_DATE) AND l.role = 'user'
        GROUP BY 
            DATE_FORMAT(f.timestamp, '%Y-%m');
    `;
  db.query(sql, (err, data) => {
    if (err) return res.json({ Error: "Error fetching data" });
    res.json(data);
  });
});

app.get("/about", (req, res) => {
  const query =  `
  SELECT a.id, a.text, a.last_modified_by, l.name AS last_modified_by_name 
  FROM about a 
  LEFT JOIN login l ON a.last_modified_by = l.id
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching About Us text." });
    }
    if (result.length > 0) {
      return res.json({ Status: "Success", aboutText: result });
    } else {
      return res.json({ Status: "Error", Error: "No About Us content found." });
    }
  });
});

app.put("/about", verifyUser, (req, res) => {
  const { id, text } = req.body;
  if (!id || !text) {
    return res.status(400).json({ message: "Text is required." });
  }

  const query = "UPDATE about SET text = ?, last_modified_by = ? WHERE id = ?";
  db.query(query, [text, req.user_id, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving About Us text." });
    }
    if (result.affectedRows > 0) {
      return res.json({
        Status: "Success",
        Message: "About Us content updated successfully.",
      });
    } else {
      return res.json({
        Status: "Error",
        Error: "No row found with the given id.",
      });
    }
  });
});

// Get all FAQs
app.get("/faqs", (req, res) => {
  db.query("SELECT * FROM faqs", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch FAQs" });
    }
    res.json(results);
  });
});

// Add a new FAQ
app.post("/faqs", verifyUser, (req, res) => {
  const { question, answer } = req.body;
  db.query(
    "INSERT INTO faqs (question, answer, last_modified_by) VALUES (?, ?, ?)",
    [question, answer, req.user_id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to add FAQ" });
      }
      res.json({ message: "FAQ added successfully" });
    }
  );
});

// Update an FAQ
app.put("/faqs/:id", verifyUser, (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  db.query(
    "UPDATE faqs SET question = ?, answer = ?, last_modified_by = ? WHERE id = ?",
    [question, answer, req.user_id, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update FAQ" });
      }
      res.json({ message: "FAQ updated successfully" });
    }
  );
});

// Delete an FAQ
app.delete("/faqs/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM faqs WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete FAQ" });
    }
    res.json({ message: "FAQ deleted successfully" });
  });
});

app.listen(port, () => {
  console.log("listening");
});
