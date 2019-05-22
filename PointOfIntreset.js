var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');
var rank = 3.5;

app.use(express.json());


// TODO: tests
exports.getRandomThreeMostPopularPointOfIntrest = function (req, res) {
    try {
        var sql = "SELECT * FROM POI ORDER BY rank DESC where rank >= '" + rank + "'";
          DButilsAzure.execQuery(sql)
            .then(function (result) {
                var POI = [];
                var i = 0;
                while (POI.length < 3) {
                    var index = Math.floor(Math.random() * (result.length + 1)) + min;
                    POI[i] = result[index];
                    i++;
                }
                res.send(result);
            })
            .catch(function (err) {
                console.log(err);
                res.send(err)
            });
    } catch (e) {
        console.log(e);
        if (e instanceof CustomError) {
            res.status(400).send(e.message)
        }
    }

};


// TODO : test
exports.addReview = function (req, res) {
    var name = req.body.name;
    var rank = req.body.rank;
    var review = req.body.review;
    var date = new Date();
    var id = 1;
    try {
        var sql = "SELECT * FROM POIreview";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                id = result.length;
            })
            .catch(function (err) {
                console.log(err);
            });
    } catch (e) {
        console.log(e);
        if (e instanceof CustomError) {
            res.status(400).send(e.message)
        }
    }
    try {
        sql = "INSERT INTO POIreview (id, name, review, rank, date) VALUES ('" + id + "', '" + name + "', '" + review +
            "', '" + rank + "', '" + date + "'";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                res.send(result);
            })
            .catch(function (err) {
                console.log(err);
            });
    } catch (e) {
        console.log(e);
        if (e instanceof CustomError) {
            res.status(400).send(e.message)
        }
    }
};

// TODO : test
exports.getRecomendedinterest = function (req, res){
    var userName = req.params.userName;
    var sql = "SELECT POI.name, POI.picture " +
        "FROM UsersCategories JOIN POI " +
        "ON UsersCategories.name = POI.category WHERE UsersCategories.user_name = " + userName +
        "AND POI.rank >3";
    DButilsAzure.execQuery(sql)
    .then (function (result){
        if(result[0].length!=0){
           for (var i = 0 ; i < 2 ; i++){
                res.send(result[i]);
            }
        }
    })
        .catch(function(err){
            res.send('there is not categories to this user')
        })
};

// TODO : test
exports.getinterestInfo = function (req, res){
    var interestName = req.params.interestName;
    var sql = "SELECT POI.description, POI.number_of_watch, AVG(OPI.rank)*100/5, max(date) as MaxDate "+
        "FROM POI JOIN POIreview " +
        "ON POI.name = POIreview.name WHERE POI.name = " + interestName ;


};