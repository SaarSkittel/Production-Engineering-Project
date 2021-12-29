const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const request = require("request");
const cheerio = require("cheerio");
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

//CREATE TABLE IF NOT EXISTS users(id INTEGER AUTO_INCREMENT, user_name VARCHAR(255) NOT NULL, full_name TEXT NOT NULL, password TEXT NOT NULL, PRIMARY KEY(id, user_name));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    createConnection();
    databaseSetup();
});

app.get("/", async(req, res) => {
    res.sendStatus(200);
    /*request(
                                                                                                                                                                                                                                                                                                                          "https://www.espn.com/nba/team/schedule/_/name/mia",
                                                                                                                                                                                                                                                                                                                          (error, response, html) => {
                                                                                                                                                                                                                                                                                                                              if (!error && response.statusCode == 200) {
                                                                                                                                                                                                                                                                                                                                  const $ = cheerio.load(html);
                                                                                                                                                                                                                                                                                                                                  const elementSelector =
                                                                                                                                                                                                                                                                                                                                      "#fittPageContainer > div.StickyContainer > div.page-container.cf > div > div.layout__column.layout__column--1 > section > div > section > section > div > div > div > div.Table__Scroller > table > tbody > tr";
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
                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                      );*/
});

app.post("/register", (req, res) => {
    //CHECK IF THE USER ALREADY EXISTS
    try {
        let values = [req.body.userName, req.body.fullName, req.body.password];
        addUser(values);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
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
    } catch (err) {
        console.log(err);
        res.sendStatus(304);
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
        } else if (name !== undefined) {
            getUserInfoByName(name).then((result) =>
                res.status(201).send(JSON.stringify(result))
            );
        } else {
            getAllUserInfo().then((result) =>
                res.status(201).send(JSON.stringify(result))
            );
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.delete("/logout", (req, res) => {
    try {
        const token = req.cookies.AccessToken;
        const user = jwt.decode(token, process.env.ACCCESS_TOKEN_SECRET).user_name;
        logout(user);
        res.clearCookie("RefreshToken").sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(304);
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
                    return res.sendStatus(403);
                } else if (dbstring !== JSON.stringify(refreshToken)) {
                    return res.sendStatus(403);
                } else if (!(await verifyRefreshToken(refreshToken))) {
                    return res.sendStatus(403);
                } else {
                    console.log("all good");
                    res.json({ AccessToken: await generateAccessToken(userName) });
                }
            })
            .catch((err) => console.log(err));
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.post("/login", async(req, res) => {
    await getUserInfoForLogin(req.body.userName)
        .then(async(result) => {
            if (!result || result.password !== req.body.password) {
                res.sendStatus(204);
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
            } else {
                res.sendStatus(400);
            }
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(403);
        });
});

app.get("/auth", verifyAccessToken, (req, res) => {
    try {
        res.status(202).send(JSON.stringify({ loginStatus: true }));
    } catch (err) {
        res.sendStatus(401);
    }
});