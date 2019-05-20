var express = require('express');
var app = express();
var user = require('./Users');
var POI = require('./PointOfIntreset');

var categories = ["Night life", "Museums", "Food and Drinks", "Sailing and water sports"];

app.use(express.json());

var port = 3000;

app.listen(port, function () {
    console.log('App listening on port ' + port);
});


app.post('/login', function (req, res) {
    user.login(req,res);
});


app.post('/register', function (req, res, err) {
    user.register(req,res, err);
});


app.post('/getPassword', function (req, res) {
    user.getPassword(req,res);
});


app.get('/getRandomThreeMostPopularPointOfIntrest', function (req, res) {
    POI.getRandomThreeMostPopularPointOfIntrest(req,res);
});

// TODO
app.get('/getRecomendedinterest', function (req, res) {

});

// TODO
app.get('/getLastTwoSavedinterest', function (req, res) {

});

// TODO
app.get('/getinterestInfo', function (req, res) {

});


app.get('/getCategories', function (req, res) {
    res.send(categories);
});

// TODO : maybe moving it to client side
app.get('/searchInterestByName', function (req, res) {

});

// TODO : maybe moving it to client side
app.get('/searchInterestByCategory', function (req, res) {

});

// TODO
app.put('/saveInterest', function (req, res) {

});

// TODO
app.post('/deleteInterest', function (req, res) {

});

// TODO
app.post('/getAllSavedInterest', function (req, res) {

});


app.post('/addReview', function (req, res) {
    POI.addReview(req,res);
});








