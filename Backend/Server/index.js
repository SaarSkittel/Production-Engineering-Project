const express = require("express");
const app = express();
const port = process.env.PORT || 80;
app.get("/", (req, res) =>
    res.json({ message: `Hello world from port ${port}!!!` })
);
app.post("/register");
app.post("/changePassword");
app.get("/users");
app.get("/users/name?");
app.get("/users/id?");
app.get("/login");

app.listen(port, () => console.log(`Listening on port ${port}`));