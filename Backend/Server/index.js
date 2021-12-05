const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
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

function databaseSetup() {
    connection.connect((err) => {
        connection.query(
            "CREATE TABLE IF NOT EXISTS users(id INTEGER AUTO_INCREMENT, user_name VARCHAR(255) NOT NULL, full_name TEXT NOT NULL, password TEXT NOT NULL, token TEXT, PRIMARY KEY(id, user_name));",
            (err, result) => {
                if (err) throw err;
            }
        );
    });
}

const port = process.env.PORT || 80;

//CREATE TABLE IF NOT EXISTS users(id INTEGER AUTO_INCREMENT, user_name VARCHAR(255) NOT NULL, full_name TEXT NOT NULL, password TEXT NOT NULL, PRIMARY KEY(id, user_name));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    databaseSetup();
});

app.get("/", (req, res) => {
    //verifyAccessToken(req, res);
    connection.connect((err) => {
        connection.query("SELECT * FROM users", (err, result, fields) => {
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

app.post("/login", (req, res) => {
    connection.query(
        "SELECT * FROM users WHERE user_name= ?;",
        req.body.userName,
        (err, result, fields) => {
            if (err) {
                console.log(err);
                throw err;
            } else if (result.length === 0) {
                res.send(
                    JSON.stringify({
                        response: "Error",
                        port: port,
                        status: "User doesn't exist",
                    })
                );
            } else if (
                result[0].user_name === req.body.userName &&
                result[0].password === req.body.password
            ) {
                console.log(result[0].user_name);
                jwt.verify(req.token, process.env.ACCCESS_TOKEN_SECRET, (err) => {
                    if (err) {
                        const userName = req.body.userName;
                        const user = { name: userName };
                        const accessToken = generateAccessToken(user);
                        connection.query("UPDATE users SET token = ? WHERE id = ?", [
                            accessToken,
                            result[0].id,
                        ]);
                        console.log(accessToken);
                        res.send(
                            JSON.stringify({
                                response: "OK",
                                port: port,
                                status: "Assigned new token",
                                accessToken: accessToken,
                            })
                        );
                    } else {
                        res.send(
                            JSON.stringify({
                                response: "OK",
                                port: port,
                                status: "Valid token",
                                accessToken: result[0].token,
                            })
                        );
                        console.log(accessToken);
                    }
                });
            }
        }
    );
});

function verifyAccessToken(req, res) {
    const token = req.body.token;
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
    });
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCCESS_TOKEN_SECRET, { expiresIn: "24h" });
}