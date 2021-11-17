const express = require("express");
const mysql = require("mysql");
const app = express();
const connection = mysql.createConnection({
    host: "172.28.0.8",
    port: "3306",
    user: "Saar",
    password: "Password",
    database: "users",
});

const port = process.env.PORT || 80;

app.get("/", (req, res) => {
    connection.connect(function(err) {
        connection.query("SELECT * FROM users", function(err, result, fields) {
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
    });
});
app.post("/register");
app.post("/changePassword");
app.get("/users");
app.get("/users/name?");
app.get("/users/id?");
app.get("/login");

app.listen(port, () => console.log(`Listening on port ${port}`));