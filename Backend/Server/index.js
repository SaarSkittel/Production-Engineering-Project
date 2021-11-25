const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const e = require("express");
const app = express();

app.use(cors());
app.use(express.json());

//CONNEFION TO DB
const connection = mysql.createConnection({
    host: "172.28.0.8",
    port: "3306",
    user: "Saar",
    password: "Password",
    database: "users",
});
//CREATE TABLE IF NOT EXISTS users(id INTEGER AUTO_INCREMENT, user_name VARCHAR(255) NOT NULL, full_name TEXT NOT NULL, password TEXT NOT NULL, PRIMARY KEY(id, user_name));
const port = process.env.PORT || 80;

app.get("/", (req, res) => {
    connection.connect(function(err) {
        connection.query("SELECT * FROM users", function(err, result, fields) {
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
    });
});

app.post("/register", (req, res) => {
    //CHECK IF THE USER ALREADY EXISTS
    connection.query(
        "SELECT user_name FROM users WHERE user_name= ?;",
        req.body.userName,
        (err, result, fields) => {
            if (err) throw err;
            //INSERT USER TO DB W/ HANDLING ERRORS
            if (result.length === 0) {
                let query =
                    "INSERT INTO users (user_name, full_name, password) VALUES (?)";
                let values = [req.body.userName, req.body.fullName, req.body.password];
                connection.query(query, [values], (err, result) => {
                    if (err) {
                        res.send(
                            JSON.stringify({ response: "Error", port: port, status: err })
                        );
                        throw err;
                    } else {
                        res.send(
                            JSON.stringify({ response: "OK", port: port, status: result })
                        );
                    }
                });
            } else {
                //IF THE USER EXISTS
                res.send(
                    JSON.stringify({
                        response: "error",
                        port: port,
                        status: "User already esists.",
                    })
                );
            }
        }
    );
});

app.post("/changePassword");
app.get("/users");
app.get("/users/name?");
app.get("/users/id?");
app.get("/login");

app.listen(port, () => console.log(`Listening on port ${port}`));