const express = require("express");
const app = express();
const port = process.env.PORT || 80;
app.get("/", (req, res) =>
    res.json({ message: `Hello world from port ${port}!!!` })
);
app.listen(port, () => console.log(`Listening on port ${port}`));