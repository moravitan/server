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


exports.saveInterest = function (req, res) {
    var userName = res.user_name.toString();
    var name = req.body.interest_name;
    var date = new Date().toISOString();
    var isValid = true;
    for (let i = 0; i < name.length; i++) {
        var sql = "INSERT INTO UsersPOI (user_name,name, date, position) values ('" + userName + "', " +
            "'" + name[i] + "', '" + date + "', '"+i+"')";
        DButilsAzure.execQuery(sql).then(function (result) {
        }).catch(error => {
            isValid = false;
            console.log(error);
            res.sendStatus(400);
        });
    }
    if (isValid){
        res.sendStatus(200);
    }
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

exports.saveSortedInterest = async function (req, res) {
    var userName = res.user_name;
    var interest = req.body.interests;
    var isValid = true;
    if (interest === undefined) {
        res.sendStatus(400);
    }
    else {
        for (let i = 0; i < interest.length; i++) {
            var sql = "SELECT * from UsersPOI where name = '" + interest[i] + "'";
            // var sql = "UPDATE UsersPOI set position = '" + i + "' where name = '" + interest[i] + "' and user_name = '"+userName+"'";
           DButilsAzure.execQuery(sql).then(function (result) {
               if (Object.keys(result).length > 0){
                   var update = "UPDATE UsersPOI set position = '" + i + "' where name = '" + interest[i] + "' and user_name = '"+userName+"'";
                   DButilsAzure.execQuery(update).then().catch(error => console.log(error));
               }
               else{
                   var date = new Date().toISOString();
                   var insert = "INSERT INTO UsersPOI (user_name,name, date, position) values ('" + userName + "', " +
                       "'" + interest[i] + "', '" +date+ "', '"+i+"')";
                   DButilsAzure.insert(insert).then().catch(error => isValid = false);
               }
            }).catch(error => {isValid = false;});
        }
        if (isValid){
            res.sendStatus(200);
        }
        else{
            res.sendStatus(400);
        }
    }

};


exports.getSortedInterest = function (req, res) {
    var userName = res.user_name;
    var sql = "SELECT POI.name, POI.picture, POI.category, POI.rank from POI join UsersPOI on POI.name = UsersPOI.name " +
        "where UsersPOI.user_name = '"+userName+"' order by UsersPOI.position asc";
    DButilsAzure.execQuery(sql).then(result => res.send(result)).catch(error => console.log(error));
};