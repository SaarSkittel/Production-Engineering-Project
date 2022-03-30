const lynx = require("lynx");

var server_opt = {};
server_opt.prefix = process.env.NAME + "Metrics";
var serverMetrics = new lynx("172.28.0.10", 8125, server_opt);

var db_opt = {};
db_opt.prefix = "DataBase";
var dbMetrics = new lynx("172.28.0.10", 8125, db_opt);

var user_opt = {};
user_opt.prefix = "Users";
var userMetrics = new lynx("172.28.0.10", 8125, user_opt);

function incrementUserCount() {
    userMetrics.increment("logged_in_users_count");
}

function decrementUserCount() {
    userMetrics.decrement("logged_in_users_count");
}

function increment200Status() {
    serverMetrics.increment("status_200");
}

function increment300Status() {
    serverMetrics.increment("status_300");
}

function increment400Status() {
    serverMetrics.increment("status_400");
}

function queryTiming(time) {
    dbMetrics.timing("query_timing", time);
}
module.exports = {
    incrementUserCount,
    decrementUserCount,
    queryTiming,
    increment200Status,
    increment300Status,
    increment400Status,
};