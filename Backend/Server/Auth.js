const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

async function verifyAccessToken(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        console.log("access token:" + token);
        console.log("is null? " + !token);
        if (!token) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                next();
            }
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
}

async function verifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async(err, user) => {
                if (err) {
                    console.log("ref ver error " + err + " token provided:" + token);
                    resolve(false);
                    //res.sendStatus(401);
                }
                console.log("verified");
                resolve(true);
            });
        } catch (err) {
            console.log(err);
            resolve(false);
            //res.sendStatus(401);
        }
    });
}

async function generateRefreshToken(user) {
    return new Promise((resolve, reject) =>
        resolve(
            jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" })
        )
    );
}

async function generateAccessToken(user) {
    return new Promise((resolve, reject) => {
        console.log(user);

        resolve(
            jwt.sign({ user_name: user }, process.env.ACCCESS_TOKEN_SECRET, {
                expiresIn: "1h",
            })
        );
    });
}
module.exports = {
    verifyAccessToken,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
};