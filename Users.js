const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
const DButilsAzure = require('./DButils');

const key = "yuvalMor";

app.use(express.json());

exports.login = function (req, res) {
    try {
        var userName = req.body.user_name;
        var password = req.body.password;
        var sql = "SELECT password FROM Users where user_name = '" + userName + "'";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                if (result[0].password === password) {
                    payload = { user_name: userName, admin: false };
                    options = { expiresIn: "1d" };
                    const token = jwt.sign(payload, key, options);
                    res.send(token);
                } else {
                    res.send("something went wrong");
                }
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


// TODO : add interest point to user
exports.register = function (req, res) {
    var userName = generateRandomCharacters(3, 8, false);
    var password = generateRandomCharacters(5, 10, true);
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var city = req.body.city;
    var country = req.body.country;
    var email = req.body.email;
    var question = req.body.question;
    var answer = req.body.answer;
    var category = req.body.interest;
    var sql = "INSERT INTO Users ([user_name], [password],[first_name], [last_name], [city], [country], [email]) VALUES ('" + userName + "', '" + password + "', '" + firstName + "', '" + lastName + "', '" + city + "', '" + country + "', '" + email + "')";
    try {
        DButilsAzure.insert(sql)
            .then(function (result) {
                var details = {
                    "user_name": userName,
                    "password": password
                };
                for (let i = 0; i < category.length; i++) {
                    var select = "SELECT FROM UsersCategories where name = '" +category[i]+ "'";
                    DButilsAzure.execQuery(select).then(function (result){
                        if (result.length > 0){
                            var sql = "INSERT INTO UsersCategories (user_name, name) VALUES ('" + userName + "','" + category[i] + "')";
                            DButilsAzure.insert(sql).then().catch(function (err) {
                                console.log(err);
                                // res.send(err)
                            });
                        }
                    }).catch(function (err) {
                        console.log(err);
                        res.send(err);});
                    }
            res.send(details);})
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

function generateRandomCharacters(min, max, isPassword) {
    var isContainDigit = false;
    var isContainAlpha = false;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (isPassword) {
        characters += "0123456789";
    }
    var charactersLength = characters.length;
    var length = Math.floor(Math.random() * (max - min + 1)) + min;
    for (var i = 0; i < length; i++) {
        var char = characters.charAt(Math.floor(Math.random() * charactersLength));
        result += char;
        if (isPassword && !isNaN(char)) {
            isContainDigit = true;
        }
        if (isPassword && isNaN(char)) {
            isContainAlpha = true;
        }
    }
    if ((isPassword && isContainAlpha && isContainDigit) || !isPassword) {
        return result;
    } else {
        return generateRandomCharacters(min, max, isPassword);
    }

}


exports.getPassword = function (req, res) {
    try {
        var userName = req.body.user_name;
        var question = req.body.question;
        var answer = req.body.answer;
        var sql = "SELECT password, question, answer FROM Users where user_name = '" + userName + "'";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                if (result[0].question === question && result[0].answer === answer) {
                    res.send(result[0].password);
                } else {
                    // res.send("Something went wrong");
                    res.send(new Error());
                }
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

exports.getLastTwoSavedinterest = function (req, res){

};

exports.getAllSavedInterest = function (req, res){};


exports.deleteInterest = function (req, res){};


exports.saveInterest = function (req, res){};