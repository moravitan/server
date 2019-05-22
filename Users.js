const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
const DButilsAzure = require('./DButils');

const key = "yuvalMor";

var userName;
var password;

app.use(express.json());

exports.login = function (req, res) {
    try {
        var userName = req.body.user_name;
        var password = req.body.password;
        var sql = "SELECT password FROM Users where user_name = '" + userName + "'";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                if (result.length > 0 && result[0].password === password) {
                    payload = {user_name: userName, admin: false};
                    options = {expiresIn: "1d"};
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
    userName = generateRandomCharacters(3, 8, false);
    password = generateRandomCharacters(5, 10, true);
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var city = req.body.city;
    var country = req.body.country;
    var email = req.body.email;
    var sql = "INSERT INTO Users ([user_name], [password],[first_name], [last_name], [city], [country], [email]) VALUES ('" + userName + "', '" + password + "', '" + firstName + "', '" + lastName + "', '" + city + "', '" + country + "', '" + email + "')";
    DButilsAzure.insert(sql)
        .then(function (result) {
        })
        .catch(function (err) {
            console.log(err);
            res.send(err)
        });
    var category = req.body.interest;
    for (let i = 0; i < category.length; i++) {
        sql = "INSERT INTO UsersCategories (user_name, name) VALUES ('" + userName + "','" + category[i] + "')";
        DButilsAzure.insert(sql).then(function (result) {
        })
            .catch(function (err) {
                console.log(err);
                res.send(err);
                //res.send("Category isn't recognized")
            });
    }
    var question = req.body.question;
    var answer = req.body.answer;
    if (question.length !== answer.length) {
        res.send("Number of questions doesn't much number of answers")
    }
    for (let i = 0; i < question.length; i++) {
        sql = "INSERT INTO UsersQuestions (user_name, question, answer) VALUES ('" + userName + "','" + question[i] + "', '" + answer[i] + "')";
        DButilsAzure.insert(sql).then(function (result) {
        })
            .catch(function (err) {
                console.log(err);
                res.send(err);
            });
    }
    var details = {"user_name": userName, "password": password};
    res.send(details);
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
        var sql = "SELECT Users.password FROM UsersQuestions join Users " +
            "on Users.user_name = UsersQuestions.user_name where UsersQuestions.user_name = '" + userName + "' " +
            "and UsersQuestions.question = '" + question + "' and UsersQuestions.answer = '" + answer + "'";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                if (Object.keys(result).length > 0) {
                    res.send(result[0].password);
                }
                else{
                    res.sendStatus(404);
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


