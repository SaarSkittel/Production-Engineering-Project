const express = require("express");
const app = express();


app.get("/", (req, res) => res.send("hellow world!!!"));
const port = process.env.PORT || 80;
app.listen(80, () => console.log(`Listening on port ${port}`));