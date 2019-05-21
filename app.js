const express = require('express');
const app = express();
const user = require('./Users');
const POI = require('./PointOfIntreset');

var categories = ["Night life", "Museums", "Food and Drinks", "Sailing and water sports"];

app.use(express.json());

var port = 3000;

app.listen(port, function () {
    console.log('App listening on port ' + port);
});



app.post('/login',  (req, res) => {
    user.login(req,res);
});


app.post('/register', (req, res) => {
    user.register(req,res);
});


app.post('/getPassword',(req, res) => {
    user.getPassword(req,res);
});


app.get('/getRandomThreeMostPopularPointOfIntrest', (req, res) => {
    POI.getRandomThreeMostPopularPointOfIntrest(req,res);
});

// TODO
app.get('/getRecomendedinterest', (req, res) => {

});

// TODO
app.get('/getLastTwoSavedinterest', (req, res) => {

});

// TODO
app.get('/getinterestInfo', (req, res) => {

});


app.get('/getCategories', (req, res) =>{
    res.send(categories);
});

/*// TODO : maybe moving it to client side
app.get('/searchInterestByName', (req, res) => {

});

// TODO : maybe moving it to client side
app.get('/searchInterestByCategory', (req, res) => {

});*/

// TODO
app.get('/getAllInterests', (req, res) => {

});

// TODO
app.put('/saveInterest', (req, res) =>{

});

// TODO
app.post('/deleteInterest', (req, res) => {

});

// TODO
app.post('/getAllSavedInterest', (req, res) => {

});


app.post('/addReview', (req, res) => {
    POI.addReview(req,res);
});








