var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');

var rank = 60;

app.use(express.json());


exports.getRandomThreeMostPopularPointOfInterest = function (req, res) {
    try {
        var sql = "SELECT name, picture, category, rank FROM POI where rank >= '" + rank + "' ORDER BY rank DESC";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                var POI = [];
                var POInames = [];
                var i = 0;
                while (POI.length < 3) {
                    var index = Math.floor(Math.random() * (Object.keys(result).length));
                    if (!POInames.includes(result[index].name)) {
                        POI[i] = result[index];
                        POInames[i] = result[index].name;
                        i++;
                    }
                }
                res.send(POI);
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


exports.addReview = function (req, res) {
    var name = req.body.name;
    var rank = req.body.rank;
    var review = req.body.review;
    var date = new Date().toISOString();
    var id = 1;
    if (name === undefined || rank === undefined || review === undefined){
        res.sendStatus(400);
    }
    else {
        try {
            var sql = "SELECT * FROM POIreview";
            DButilsAzure.execQuery(sql)
                .then(function (result) {
                    id += Object.keys(result).length;
                    sql = "INSERT INTO POIreview (id, name, review, rank, date) VALUES ('" + id + "', '" + name + "', '" + review +
                        "', '" + rank + "', '" + date + "')";
                    DButilsAzure.execQuery(sql)
                        .then(function (result) {
                            res.sendStatus(200);
                        })
                        .catch(function (err) {
                            console.log(err);
                            res.sendStatus(400);
                        });
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
            var selectSql = "SELECT SUM(rank) as sumRank from POIreview where name = '" + name + "' group by name";
            sql = "SELECT * from POIreview where name = '" + name + "'";
            DButilsAzure.execQuery(sql)
                .then(function (result) {
                    var size = 1 + Object.keys(result).length;
                    console.log(size);
                    DButilsAzure.execQuery(selectSql)
                        .then(function (result) {
                            var total = 0;
                            if (Object.keys(result).length > 0) {
                                total = parseInt(result[0].sumRank);
                            }
                            console.log(total);
                            var newRank = parseInt(((total / size) / 5) * 100);
                            console.log(newRank);
                            sql = "UPDATE POI set rank = '" + newRank.toString() + "' where name = '" + name + "'";
                            DButilsAzure.execQuery(sql)
                                .then(function (result) {
                                })
                                .catch(function (err) {
                                    console.log(err);
                                });
                        })
                        .catch(function (err) {
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                });
        } catch (e) {
            console.log(e);
            if (e instanceof CustomError) {
                res.status(400).send(e.message)
            }
        }
    }
};


exports.getAllPOI = function (req, res) {
    var sql = "SELECT name, picture, rank, category FROM POI";
    DButilsAzure.execQuery(sql)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
        })
};


exports.getInterestInfo = function (req, res) {
    var interestName = req.params.interest_name;
    if (interestName === undefined){
        res.sendStatus(400);
    }
    else {
        var sql = "SELECT POI.name, POI.description, POI.number_of_watchers, POI.rank as rank, POIreview.review, " +
            "POIreview.rank as reviewRank , POIreview.date  " +
            "FROM POI JOIN POIreview " +
            "ON POI.name = POIreview.name WHERE POIreview.name = '" + interestName + "' order by POIreview.date desc";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                var response = [];
                if (Object.keys(result).length > 0) {
                    for (var i = 0; i < 2 && i < Object.keys(result).length; i++) {
                        response[i] = result[i];
                    }
                }
                res.send(response);
            })
            .catch(function (err) {
                res.sendStatus(400);
            })
        sql = "UPDATE POI set number_of_watchers = number_of_watchers + 1 where name = '" + interestName + "'";
        DButilsAzure.execQuery(sql).then().catch();
    }
};

