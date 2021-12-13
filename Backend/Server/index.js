const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
//CONNEFION TO DB
const connection = mysql.createConnection({
    host: "172.28.0.8",
    port: "3306",
    user: "Saar",
    password: "Password",
    database: "users",
});

//CREATE TABLE IN DB
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
    const token = req.cookies.AccessToken;
    console.log(`Request cookies: ${token}`);
    let verification = verifyAccessToken(token);
    if (verification === true) {
        const user = jwt.decode(token, process.env.ACCCESS_TOKEN_SECRET).user_name;
        console.log(`User name: ${user}`);
        res.send(JSON.stringify(`Hello, ${user}`));
    }
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

app.post("/changePassword", (req, res) => {
    const verify = verifyAccessToken(req.body.token);
    if (verify === true) {
        const user = jwt.decode(req.body.token).user_name;
        connection.query("UPDATE users SET password = ? WHERE user_name = ?", [
            req.body.password,
            user,
        ]);
        res.cookie("AccessToken", accessToken, { httpOnly: true, path: "/" });
        res.send(
            JSON.stringify({
                response: "OK",
                port: port,
                status: "Assigned new token",
            })
        );
    }
});

app.get("/users", (req, res) => {});
app.get("/users/name?", (req, res) => {});
app.get("/users/id?", (req, res) => {});

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
                console.log(`Req Token: ${req.cookies.AccessToken}`);
                console.log(`DB Token: ${result[0].token}`);
                const verify = verifyAccessToken(result[0].token);
                console.log(`Verification: ${verify}`);
                if (verify === false) {
                    const userName = req.body.userName;
                    const user = { user_name: userName };
                    const accessToken = generateAccessToken(user);
                    connection.query("UPDATE users SET token = ? WHERE id = ?", [
                        accessToken,
                        result[0].id,
                    ]);
                    res.cookie("AccessToken", accessToken, {
                        httpOnly: true,
                    });
                    res.send(
                        JSON.stringify({
                            response: "OK",
                            port: port,
                            status: "Assigned new token",
                        })
                    );
                } else {
                    res
                        .cookie("AccessToken", result[0].token, {
                            httpOnly: true,
                        })
                        .send(
                            JSON.stringify({
                                response: "OK",
                                port: port,
                                status: "Valid token",
                            })
                        );
                }
            } else {
                res.send(
                    JSON.stringify({
                        response: "ERROR",
                        port: port,
                        status: "",
                    })
                );
            }
        }
    );
});

function verifyAccessToken(token) {
    let isValid = false;
    if (token === null) isValid = false;
    else {
        jwt.verify(token, process.env.ACCCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(`Validation error:${err}`);
                isValid = false;
            } else {
                isValid = true;
            }
        });
    }
    return isValid;
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCCESS_TOKEN_SECRET, { expiresIn: "24h" });
}