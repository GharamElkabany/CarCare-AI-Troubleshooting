import express from "express";
import mysql from "mysql";
import cors from "cors";
import path from "path";
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

app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO login (`name`,`email`,`phone`,`password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error for hashing password" });
    const values = [req.body.name, req.body.email, req.body.phone, hash];
    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inserting data Error in server" });
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE  email = ? OR phone = ?";
  db.query(
    sql,
    [req.body.email || req.body.phone, req.body.email || req.body.phone],
    (err, data) => {
      if (err) return res.json({ Error: "Login error in server" });
      if (data.length > 0) {
        bcrypt.compare(
          req.body.password.toString(),
          data[0].password,
          (err, response) => {
            if (err) return res.json({ Error: "Password compare error" });
            if (response) {
              const { id, name, role } = data[0];
              const token = jwt.sign({ id, name, role }, "jwt-secret-key", {
                expiresIn: "1d",
              });
              res.cookie("token", token);
              return res.json({ Status: "Success", role });
              console.log("JWT Payload:", { id, name, role });
            } else {
              return res.json({ Error: "Password not matched" });
            }
          }
        );
      } else {
        return res.json({
          Error: "No account found with the provided email or phone number",
        });
      }
    }
  );
});

app.get("/users", verifyUser, (req, res) => {
  const sql =
    'SELECT id, name, email, phone, role FROM login WHERE role = "user"';
  db.query(sql, (err, data) => {
    if (err) {
      return res.json({ Error: "Error fetching users" });
    }
    return res.json(data); // Send filtered user data
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
  const { name, email, phone } = req.body;

  const sql = "UPDATE login SET name = ?, email = ?, phone = ? WHERE name = ?";
  db.query(sql, [name, email, phone, req.name], (err, result) => {
    if (err) {
      return res.json({ Error: "Error updating user data" });
    }
    return res.json({ Status: "Profile updated successfully" });
  });
});

app.put("/user/change-password", verifyUser, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const sqlGetPassword = "SELECT password FROM login WHERE name = ?";
  const sqlUpdatePassword = "UPDATE login SET password = ? WHERE name = ?";

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
            db.query(
              sqlUpdatePassword,
              [hashedPassword, req.name],
              (err, result) => {
                if (err) return res.json({ Error: "Error updating password" });
                return res.json({ Status: "Password updated successfully" });
              }
            );
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

  const sql = `SELECT f.id, l.name, f.rating, f.feedback, f.timestamp 
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
  const query = "SELECT id, text FROM about";
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

app.put("/about", (req, res) => {
  const { id, text } = req.body;
  if (!id || !text) {
    return res.status(400).json({ message: "Text is required." });
  }

  const query = "UPDATE about SET text = ? WHERE id = ?";
  db.query(query, [text, id], (err, result) => {
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
app.post("/faqs", (req, res) => {
  const { question, answer } = req.body;
  db.query(
    "INSERT INTO faqs (question, answer) VALUES (?, ?)",
    [question, answer],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to add FAQ" });
      }
      res.json({ message: "FAQ added successfully" });
    }
  );
});

// Update an FAQ
app.put("/faqs/:id", (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  db.query(
    "UPDATE faqs SET question = ?, answer = ? WHERE id = ?",
    [question, answer, id],
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
