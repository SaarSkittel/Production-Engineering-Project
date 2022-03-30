const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const {
    incrementUserCount,
    decrementUserCount,
    increment200Status,
    increment300Status,
    increment400Status,
} = require("./Metrics");
const {
    verifyAccessToken,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("./Auth");
const {
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
} = require("./Queries");
require("dotenv").config();

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
//CONNEFION TO DB

//CREATE TABLE IN DB

const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    createConnection();
    databaseSetup();
});

app.get("/video", (req, res) => {
    const range = req.headers.range;
    if (!range) {
        console.log("video err!!");
        res.sendStatus(400);
        increment400Status();
    }
    const videoPath = "./Storage/android2.mp4";
    const videoSize = fs.statSync(videoPath).size;

    const BLOCK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + BLOCK_SIZE, videoSize - 1);
    const contantLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contantLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    increment200Status();
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

//const elementSelector ="#fittPageContainer > div.StickyContainer > div.page-container.cf > div > div.layout__column.layout__column--1 > section > div > section > section > div > div > div > div.Table__Scroller > table > tbody > tr";
app.get("/", async(req, res) => {
    res.send("Hello");
    increment200Status();
    /*request("https://www.espn.com/nba/schedule", (error, response, html) => {
                                                    if (!error && response.statusCode == 200) {
                                                        const $ = cheerio.load(html);
                                                        const elementSelector ="#sched-container"
                                                        $(elementSelector).each((parentIndex, parentElement) => {
                                                            $(parentElement)
                                                                .children()
                                                                .each((childernIndex, childernElement) => {
                                                                    console.log($(childernElement).text());
                                                                });
                                                        });
                                                        //console.log(`table: ${table.json}`);
                                                        //res.type("text/html");
                                                        //res.send(`${table.json}`);
                                                    }
                                                });*/
});

app.post("/register", (req, res) => {
    //CHECK IF THE USER ALREADY EXISTS
    try {
        let values = [req.body.userName, req.body.fullName, req.body.password];
        addUser(values);
        res.sendStatus(200);
        increment200Status();
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        increment400Status();
    }
});

app.post("/changePassword", verifyAccessToken, (req, res) => {
    try {
        const user = jwt.decode(
            req.cookies.RefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ).user_name;
        changePassword(req.body.password, user);
        res.sendStatus(200);
        increment200Status();
    } catch (err) {
        console.log(err);
        res.sendStatus(304);
        increment300Status();
    }
});

app.post("/users", verifyAccessToken, async(req, res) => {
    const id = req.query.id;
    const name = req.query.name;
    try {
        if (id !== undefined) {
            getUserInfoByID(id).then((result) =>
                res.status(201).send(JSON.stringify(result))
            );
            increment200Status();
        } else if (name !== undefined) {
            getUserInfoByName(name).then((result) =>
                res.status(201).send(JSON.stringify(result))
            );
            increment200Status();
        } else {
            getAllUserInfo().then((result) => {
                console.log(result);
                res.status(201).send(JSON.stringify(result));
            });
            increment200Status();
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        increment400Status();
    }
});

app.delete("/logout", (req, res) => {
    try {
        const token = req.cookies.RefreshToken;
        const user = jwt.decode(token, process.env.REFRESH_TOKEN_SECRET).user_name;
        logout(user);
        res.clearCookie("RefreshToken").sendStatus(200);
        increment200Status();
        decrementUserCount();
    } catch (err) {
        console.log(err);
        res.sendStatus(304);
        increment300Status();
    }
});

app.post("/token", async(req, res) => {
    try {
        const cookie = cookieParser.JSONCookies(req.cookies);
        const refreshToken = cookie.RefreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const userName = await jwt.decode(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ).user_name;
        getRefreshToken(userName)
            .then(async(result) => {
                let tokenFromDB = result[0].refresh_token;
                let dbstring = JSON.stringify(tokenFromDB);
                if (!dbstring) {
                    increment400Status();
                    return res.sendStatus(403);
                } else if (dbstring !== JSON.stringify(refreshToken)) {
                    increment400Status();
                    return res.sendStatus(403);
                } else if (!(await verifyRefreshToken(refreshToken))) {
                    increment400Status();
                    return res.sendStatus(403);
                } else {
                    res.json({ AccessToken: await generateAccessToken(userName) });
                    increment200Status();
                }
            })
            .catch((err) => console.log(err));
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        increment400Status();
    }
});

app.post("/login", async(req, res) => {
    await getUserInfoForLogin(req.body.userName)
        .then(async(result) => {
            if (!result || result.password !== req.body.password) {
                res.sendStatus(204);
                increment200Status();
            } else if (result.password === req.body.password) {
                const userName = req.body.userName;
                const id = result.id;
                const user = { user_name: userName };
                let refreshToken = await generateRefreshToken(user);
                await updateUserRefreshToken(await refreshToken, id);
                res
                    .cookie("RefreshToken", await refreshToken, {
                        httpOnly: true,
                    })
                    .sendStatus(200);
                increment200Status();
                incrementUserCount();
            } else {
                increment400Status();
                res.sendStatus(400);
            }
        })
        .catch((err) => {
            console.log(err);
            increment400Status();
            res.sendStatus(403);
        });
});
/*
app.get("/auth", verifyAccessToken, (req, res) => {
    try {
        res.status(202).send(JSON.stringify({ loginStatus: true }));
    } catch (err) {
        res.sendStatus(401);
    }
});*/