const express = require('express');
const app = express();
const user = require('./Users');
const POI = require('./PointOfIntreset');
const usersPOI = require('./UsersPOI');
const jwt = require("jsonwebtoken");
var userName = "";

exports.userName = userName;

const categories = ["Night life", "Museums", "Food and Drinks", "Sailing and water sports"];

const routers = ["/getPassword", "/getRandomThreeMostPopularPointOfInterest", "/getRecommendedInterest",
    "/getLastTwoSavedInterest", "/getInterestInfo", "/getCategories", "/getAllPOI", "/getAllSavedInterest",
    "/saveInterest", "/deleteInterest", "/addReview", "/saveSortedInterest"];

app.use(express.json());

const key = "YuvalMor";

var port = 3000;


app.listen(port, function () {
    console.log('App listening on port ' + port);
});


app.use(routers, (req, res, next) => {
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, key);
        req.decoded = decoded;
        res.user_name = decoded.user_name;
        next(); //move on to the actual function
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
});


app.post('/login', (req, res) => {
    user.login(req, res);
});

app.post('/register', (req, res) => {
    user.register(req, res);
});


app.post('/getPassword', (req, res) => {
    user.getPassword(req, res);
});


app.get('/getRandomThreeMostPopularPointOfInterest', (req, res) => {
    POI.getRandomThreeMostPopularPointOfInterest(req, res);
});

app.get('/getRecommendedInterest', (req, res) => {
    usersPOI.getRecommendedInterest(req, res);
});


app.get('/getLastTwoSavedInterest', (req, res) => {
    usersPOI.getLastTwoSavedInterest(req, res);
});

app.get('/getInterestInfo/:interest_name', (req, res) => {
    POI.getInterestInfo(req, res);
});


app.get('/getCategories', (req, res) => {
    res.send(categories);
});

app.get('/getAllPOI', (req, res) => {
    POI.getAllPOI(req, res);
});

app.get('/getAllSavedInterest', (req, res) => {
    usersPOI.getAllSavedInterest(req, res);
});


app.put('/saveInterest', (req, res) => {
    usersPOI.saveInterest(req, res);

});

app.delete('/deleteInterest', (req, res) => {
    usersPOI.deleteInterest(req, res);
});


app.post('/addReview', (req, res) => {
    POI.addReview(req, res);
});

app.post('/saveSortedInterest', (req, res) => {

});






