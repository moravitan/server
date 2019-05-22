const express = require('express');
const app = express();
const user = require('./Users');
const POI = require('./PointOfIntreset');
const jwt = require("jsonwebtoken");
const usersPOI = require('./UsersPOI');


var categories = ["Night life", "Museums", "Food and Drinks", "Sailing and water sports"];

app.use(express.json());

const key = "yuvalMor";

var port = 3000;


app.listen(port, function () {
    console.log('App listening on port ' + port);
});


app.use('/^[login]|^[register]', (req, res, next) => {
    console.log("hey");
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, key);
        req.decoded = decoded;
        next(); //move on to the actual function
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
});


app.post('/login',  (req, res) => {
    user.login(req,res);
});


app.post('/register', (req, res, next) => {
    user.register(req,res, next);
});


app.post('/getPassword',(req, res) => {
    user.getPassword(req,res);
});


app.get('/getRandomThreeMostPopularPointOfIntrest', (req, res) => {
    POI.getRandomThreeMostPopularPointOfIntrest(req,res);
});

// TODO
app.get('/getRecomendedinterest/:userName', (req, res) => {
        POI.getRecomendedinterest(req, res);
});

// TODO
app.get('/getLastTwoSavedinterest', (req, res) => {
    usersPOI.getLastTwoSavedinterest(req,res);
});

// TODO
app.get('/getinterestInfo', (req, res) => {
    POI.getinterestInfo(req, res);
});


app.get('/getCategories', (req, res) =>{
    res.send(categories);
});

// TODO : maybe moving it to client side
app.get('/searchInterestByName', (req, res) => {

});

/*// TODO : maybe moving it to client side
app.get('/searchInterestByCategory', (req, res) => {

});*/

// TODO
app.get('/getAllInterests', (req, res) => {

});

// TODO
app.put('/saveInterest', (req, res) =>{
    usersPOI.saveInterest(req,res);

});

// TODO
app.post('/deleteInterest', (req, res) => {
    usersPOI.deleteInterest(req,res);
});

// TODO
app.post('/getAllSavedInterest', (req, res) => {
    usersPOI.getAllSavedInterest(req, res);
});


app.post('/addReview', (req, res) => {
    POI.addReview(req,res);
});








