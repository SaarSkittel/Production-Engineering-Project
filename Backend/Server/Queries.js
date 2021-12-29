const mysql = require("mysql");
const express = require("express");
let connection;

function createConnection() {
    connection = mysql.createConnection({
        host: "172.28.0.8",
        port: "3306",
        user: "Saar",
        password: "Password",
        database: "users",
    });
}

function getUserInfoByID(id) {
    return new Promise((resolve, reject) =>
        connection.query(
            "SELECT id, user_name, full_name FROM users WHERE id = ?;", [parseInt(id)],
            (err, result) => {
                if (err) {
                    //res.sendStatus(404);
                    throw err;
                } else {
                    //console.log(`id name: ${JSON.stringify(result)}`);
                    //res.send(result);
                    return result;
                }
            }
        )
    );
}

function getUserInfoByName(name) {
    return new Promise((resolve, reject) =>
        connection.query(
            "SELECT id, user_name, full_name FROM users WHERE user_name = ?;", [name],
            (err, result) => {
                if (err) {
                    //res.sendStatus(404);
                    return reject(err);
                } else {
                    //console.log(`name users:${JSON.stringify(result)}`);
                    //res.send(result);
                    resolve(result);
                }
            }
        )
    );
}

function getAllUserInfo() {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT id, user_name, full_name FROM users;",
            (err, result) => {
                if (err) {
                    //res.sendStatus(404);
                    return reject(err);
                } else {
                    //console.log(`all users: ${JSON.stringify(result)}`);
                    //res.send(result);
                    resolve(result);
                }
            }
        );
    });
}

function changePassword(password, user) {
    connection.query(
        "UPDATE users SET password = ? WHERE user_name = ?;", [password, user],
        (err, result) => {
            if (err) {
                //res.sendStatus(401);
                throw err;
            }
        }
    );
}

function logout(user) {
    connection.query(
        "UPDATE users SET token = NULL WHERE user_name = ?;", [user],
        (err, result) => {
            if (err) {
                throw err;
            }
        }
    );
}

function getUserInfoForLogin(userName) {
    return new Promise((resolve, reject) =>
        connection.query(
            "SELECT * FROM users WHERE user_name= ?;",
            userName,
            (err, result, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]);
            }
        )
    );
}

function getRefreshToken(userName) {
    return new Promise((resolve, reject) =>
        connection.query(
            "SELECT refresh_token FROM users WHERE user_name=?;",
            userName,
            (err, result, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            }
        )
    );
}

function updateUserToken(token, id) {
    connection.query(
        "UPDATE users SET token = ? WHERE id = ?", [token, id],
        (err, result, fields) => {
            if (err) {
                throw err;
            }
        }
    );
}

function updateUserRefreshToken(token, id) {
    return new Promise((resolve, reject) => {
        console.log("query token: " + token);
        connection.query(
            "UPDATE users SET refresh_token = ? WHERE id = ?;", [token, id],
            (err, result, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            }
        );
    });
}

function addUser(values) {
    try {
        let result = getUserInfoByName(connection, values[0]);
        if (result.length === 0) {
            let query =
                "INSERT INTO users (user_name, full_name, password) VALUES (?);";
            connection.query(query, [values], (err, result) => {
                if (err) {
                    throw err;
                }
            });
        } else {
            throw "user already exist";
        }
    } catch (err) {
        throw err;
    }
}

function databaseSetup() {
    connection.connect((err) => {
        connection.query(
            "CREATE TABLE IF NOT EXISTS users(id INTEGER AUTO_INCREMENT, user_name VARCHAR(255) NOT NULL, full_name TEXT NOT NULL, password TEXT NOT NULL, token TEXT,refresh_token TEXT, PRIMARY KEY(id, user_name));",
            (err, result) => {
                if (err) console.log(err);
            }
        );
    });
}

module.exports = {
    getUserInfoByID,
    getUserInfoByName,
    getAllUserInfo,
    changePassword,
    logout,
    getUserInfoForLogin,
    updateUserToken,
    addUser,
    createConnection,
    databaseSetup,
    updateUserRefreshToken,
    getRefreshToken,
};