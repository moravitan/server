const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
const DButilsAzure = require('./DButils');


// TODO test
exports.getLastTwoSavedinterest = function (req, res) {
    var userName = req.params.userName;
    var sql = "SELECT POI.name, POI.picture FROM UsersPOI join POI on UsersPOI.name = POI.name where " +
        "Users.POI = '" + userName + "' desc UsersPOI.date";
    DButilsAzure.execQuery(sql).then(function (result) {
        var details = {};
        for (let i = 0; i < (result.length || 2) ; i++) {
            details += result[i];
        }
        res.send(details);
    }).catch(error => console.log(error));

};

// TODO tests
exports.getAllSavedInterest = function (req, res) {
    var userName = req.body.user_name;
    var sql = "SELECT POI.name, POI.picture, POI.category, POI.rank FROM POI JOIN UsersPOI on POI.name = UsersPOI.name where UsersPOI.user_name = '" + userName + "'";
    DButilsAzure.execQuery(sql).then(function (result) {
        res.send(result);
    }).catch(error => console.log(error));
};


// TODO test
exports.deleteInterest = function (req, res) {
    var userName = req.body.user_name;
    var sql = "DELETE FROM UsersPOI where user_name = '" + userName + "'";
    DButilsAzure.execQuery(sql).then(function (result) {
        res.send(result);
    }).catch(error => console.log(error));
};

// TODO test
exports.saveInterest = function (req, res) {
    var userName = req.body.user_name;
    var name = req.body.name;
    var date = new Date();
    var sql = "INSERT INTO UsersPOI (user_name,name, date) values ('" + userName + "', '" + name + "', '" + date + "')";
    DButilsAzure.execQuery(sql).then(function (result) {
        res.send(result);
    }).catch(error => console.log(error));
};