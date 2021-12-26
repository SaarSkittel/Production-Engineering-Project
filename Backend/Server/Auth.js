const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

function verifyAccessToken(req, res, next) {
    try {
        const token = cookieParser.JSONCookies(req.cookies);
        jwt.verify(
            token.AccessToken,
            process.env.ACCCESS_TOKEN_SECRET,
            (err, user) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(401);
                } else {
                    next();
                }
            }
        );
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCCESS_TOKEN_SECRET, { expiresIn: "24h" });
}
module.exports = { verifyAccessToken, generateAccessToken };