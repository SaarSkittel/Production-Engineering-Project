const mysql = require("mysql");
const express = require("express");
const { queryTiming } = require("./Metrics");
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
    return new Promise((resolve, reject) => {
        var pre_query = new Date().getTime();
        connection.query(
            "SELECT id, user_name, full_name FROM users WHERE id = ?;", [parseInt(id)],
            (err, result) => {
                var post_query = new Date().getTime();
                if (err) {
                    //res.sendStatus(404);
                    return reject(err);
                } else {
                    var duration = (post_query - pre_query) / 1000;
                    queryTiming(duration);
                    //console.log(`id name: ${JSON.stringify(result)}`);
                    //res.send(result);
                    resolve(result);
                }
            }
        );
    });
}

function getUserInfoByName(name) {
    return new Promise((resolve, reject) => {
        var pre_query = new Date().getTime();
        connection.query(
            "SELECT id, user_name, full_name FROM users WHERE user_name = ?;", [String(name)],
            (err, result) => {
                var post_query = new Date().getTime();
                if (err) {
                    //res.sendStatus(404);
                    return reject(err);
                } else {
                    var duration = (post_query - pre_query) / 1000;
                    queryTiming(duration);
                    //console.log(`name users:${JSON.stringify(result)}`);
                    //res.send(result);
                    resolve(result);
                }
            }
        );
    });
}

function getAllUserInfo() {
    return new Promise((resolve, reject) => {
        var pre_query = new Date().getTime();
        connection.query(
            "SELECT id, user_name, full_name FROM users;",
            (err, result) => {
                var post_query = new Date().getTime();
                if (err) {
                    //res.sendStatus(404);
                    return reject(err);
                } else {
                    var duration = (post_query - pre_query) / 1000;
                    queryTiming(duration);
                    //console.log(`all users: ${JSON.stringify(result)}`);
                    //res.send(result);
                    resolve(result);
                }
            }
        );
    });
}

function changePassword(password, user) {
    var pre_query = new Date().getTime();
    connection.query(
        "UPDATE users SET password = ? WHERE user_name = ?;", [password, user],
        (err, result) => {
            var post_query = new Date().getTime();
            if (err) {
                //res.sendStatus(401);
                throw err;
            }
            var duration = (post_query - pre_query) / 1000;
            queryTiming(duration);
        }
    );
}

function logout(user) {
    var pre_query = new Date().getTime();
    connection.query(
        "UPDATE users SET token = NULL WHERE user_name = ?;", [user],
        (err, result) => {
            var post_query = new Date().getTime();
            if (err) {
                throw err;
            }
            var duration = (post_query - pre_query) / 1000;
            queryTiming(duration);
        }
    );
}

function getUserInfoForLogin(userName) {
    return new Promise((resolve, reject) => {
        var pre_query = new Date().getTime();
        connection.query(
            "SELECT * FROM users WHERE user_name= ?;",
            userName,
            (err, result, fields) => {
                var post_query = new Date().getTime();
                if (err) {
                    return reject(err);
                }
                var duration = (post_query - pre_query) / 1000;
                queryTiming(duration);
                resolve(result[0]);
            }
        );
    });
}

function getRefreshToken(userName) {
    return new Promise((resolve, reject) => {
        var pre_query = new Date().getTime();
        connection.query(
            "SELECT refresh_token FROM users WHERE user_name=?;",
            userName,
            (err, result, fields) => {
                var post_query = new Date().getTime();
                if (err) {
                    return reject(err);
                }
                var duration = (post_query - pre_query) / 1000;
                queryTiming(duration);
                resolve(result);
            }
        );
    });
}

function updateUserToken(token, id) {
    var pre_query = new Date().getTime();
    connection.query(
        "UPDATE users SET token = ? WHERE id = ?", [token, id],
        (err, result, fields) => {
            var post_query = new Date().getTime();
            if (err) {
                throw err;
            }
            var duration = (post_query - pre_query) / 1000;
            queryTiming(duration);
        }
    );
}

function updateUserRefreshToken(token, id) {
    return new Promise((resolve, reject) => {
        var pre_query = new Date().getTime();
        connection.query(
            "UPDATE users SET refresh_token = ? WHERE id = ?;", [token, id],
            (err, result, fields) => {
                var post_query = new Date().getTime();
                if (err) {
                    return reject(err);
                }
                var duration = (post_query - pre_query) / 1000;
                queryTiming(duration);
                resolve();
            }
        );
    });
}

function addUser(values) {
    try {
        connection.query(
            "SELECT id, user_name, full_name FROM users WHERE user_name = ?;", [String(values[0])],
            (err, result) => {
                var post_query = new Date().getTime();
                if (err) {
                    throw err;
                } else {
                    var duration = (post_query - pre_query) / 1000;
                    queryTiming(duration);
                    if (result.length === 0) {
                        let query =
                            "INSERT INTO users (user_name, full_name, password) VALUES (?);";
                        var pre_query = new Date().getTime();
                        connection.query(query, [values], (err, result) => {
                            var post_query = new Date().getTime();
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            var duration = (post_query - pre_query) / 1000;
                            queryTiming(duration);
                        });
                    } else {
                        console.log("user already exist");
                    }
                }
            }
        );
    } catch (err) {
        throw err;
    }
}

function databaseSetup() {
    var pre_query = new Date().getTime();
    connection.connect((err) => {
        connection.query(
            "CREATE TABLE IF NOT EXISTS users(id INTEGER AUTO_INCREMENT, user_name VARCHAR(255) NOT NULL, full_name TEXT NOT NULL, password TEXT NOT NULL, token TEXT,refresh_token TEXT, PRIMARY KEY(id, user_name));",
            (err, result) => {
                var post_query = new Date().getTime();
                if (err) throw err;
                var duration = (post_query - pre_query) / 1000;
                queryTiming(duration);
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