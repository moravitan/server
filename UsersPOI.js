const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
const DButilsAzure = require('./DButils');


exports.getLastTwoSavedInterest = function (req, res) {
    var userName = res.user_name;
    var sql = "SELECT POI.name, POI.picture, POI.rank, POI.category FROM UsersPOI join POI on UsersPOI.name = POI.name where " +
        "UsersPOI.user_name = '" + userName + "' order by UsersPOI.date desc";
    DButilsAzure.execQuery(sql).then(function (result) {
        var details = [];
        for (let i = 0; i < (result.length && 2); i++) {
            details [i] = result[i];
        }
        res.send(details);
    }).catch(error => {
        console.log(error);
        res.sendStatus(400);
    });

};


exports.getAllSavedInterest = function (req, res) {
    var userName = res.user_name;
    var sql = "SELECT POI.name, POI.picture, POI.category, POI.rank FROM POI JOIN UsersPOI on POI.name = UsersPOI.name where UsersPOI.user_name = '" + userName + "'";
    DButilsAzure.execQuery(sql).then(function (result) {
        res.send(result);
    }).catch(error => {
        console.log(error);
        res.sendStatus(404);
    });
};

exports.deleteInterest = function (req, res) {
    var userName = res.user_name;
    var name = req.body.interest_name;
    var sql = "DELETE FROM UsersPOI where user_name = '" + userName + "' and name = '" + name + "'";
    DButilsAzure.execQuery(sql).then(function (result) {
        res.send();
    }).catch(error => {
        console.log(error);
        res.sendStatus(400);
    });
};

exports.saveInterest = function (req, res) {
    var userName = res.user_name.toString();
    var name = req.body.interest_name;
    var date = new Date().toISOString();
    var sql = "INSERT INTO UsersPOI (user_name,name, date) values ('" + userName + "', '" + name + "', '" + date + "')";
    DButilsAzure.execQuery(sql).then(function (result) {
        //res.send(result);
        res.send();
        // res.sendStatus(200);
    }).catch(error => {
        console.log(error);
        res.sendStatus(400);
    });
};


exports.getRecommendedInterest = function (req, res) {
    var userName = res.user_name.toString();
    var sql = "select POI.name, POI.picture, POI.rank, POI.category FROM POI JOIN UsersCategories " +
        "ON POI.category = UsersCategories.name WHERE UsersCategories.user_name = '" + userName + "' " +
        "and rank = (select max(rank) from POI as r where r.category = POI.category) order by rank desc";
    DButilsAzure.execQuery(sql)
        .then(function (result) {
            var POI = [];
            POI.push(result[0]);
            POI.push(result[1]);
            res.send(POI);
        })
        .catch(function (err) {
            res.sendStatus(400);
        })
};

exports.saveSortedInterest = function (req, res) {
    var name = res.user_name;
    var interest = req.body.interests;
    if (interest === undefined) {
        res.sendStatus(400);
    } else {
        var sortedInterest = "";
        for (let i = 0; i < interest.length; i++) {
            sortedInterest += interest[i];
            if (i < interest.length - 1) {
                sortedInterest += ",";
            }
        }
        var sql = "UPDATE Users set sorted_POI = '" + sortedInterest + "' where user_name = '" + name + "'";
        DButilsAzure.execQuery(sql).then(function (result) {
            res.send();
        }).catch(error => {
            console.log(error);
            res.sendStatus(400);
        });
    }

};