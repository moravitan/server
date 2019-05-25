const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
const DButilsAzure = require('./DButils');

const key = "YuvalMor";

const categories = ["Night life", "Museums", "Food and Drinks", "Sailing and water sports"];

var userName;
var password;

app.use(express.json());

exports.login = function (req, res) {
    try {
        var userName = req.body.user_name;
        var password = req.body.password;
        var sql = "SELECT password FROM Users where user_name = '" + userName + "' and password = '" + password + "'";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                if (Object.keys(result).length > 0) {
                    payload = {user_name: userName, admin: false};
                    options = {expiresIn: "1d"};
                    const token = jwt.sign(payload, key, options);
                    res.send(token);
                } else {
                    res.sendStatus(400);
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

exports.register = function (req, res) {
    var isValidRequest = true;
    userName = generateRandomCharacters(3, 8, false);
    password = generateRandomCharacters(5, 10, true);
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var city = req.body.city;
    var country = req.body.country;
    var email = req.body.email;
    var questions = req.body.questions;
    var answers = req.body.answers;
    var category = req.body.interest;
    if (!checkIfValid(firstName,lastName,city,country,email,questions,answers,category)){
        res.sendStatus(400);
    }
    else {
        var sql = "INSERT INTO Users ([user_name], [password],[first_name], [last_name], [city], [country], [email]) VALUES ('" + userName + "', '" + password + "', '" + firstName + "', '" + lastName + "', '" + city + "', '" + country + "', '" + email + "')";
        DButilsAzure.insert(sql)
            .then(function (result) {
            })
            .catch(function (err) {
                console.log(err);
                res.send(err)
            });
        for (let i = 0; i < category.length; i++) {
            if (!categories.includes(category[i])){
                isValidRequest = false;
            }

        }
        for (let i = 0; i < category.length && isValidRequest; i++) {
            sql = "INSERT INTO UsersCategories (user_name, name) VALUES ('" + userName + "','" + category[i] + "')";
            DButilsAzure.insert(sql).then(function (result) {
            })
                .catch(function (err) {
                    cancel(userName);
                    console.log(err);
                    isValidRequest = false;
                    //res.send("Category isn't recognized")
                });
        }

        if (questions.length !== answers.length) {
            isValidRequest = false;
        }
        if (!isValidRequest){
            res.sendStatus(400);
        }
        else{
            for (let i = 0; i < questions.length; i++) {
                sql = "INSERT INTO UsersQuestions (user_name, question, answer) VALUES ('" + userName + "','" + questions[i] + "', '" + answers[i] + "')";
                DButilsAzure.insert(sql).then(function (result) {
                })
                    .catch(function (err) {
                        console.log(err);
                        res.send(err);
                    });
            }
            var details = {"user_name": userName, "password": password};
            res.send(details);
        }
    }
};

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
                } else {
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

function cancel(userName) {
    var sql = "DELETE from Users where user_name = '"+userName+"'";
    DButilsAzure.execQuery(sql).then().catch(error => console.log(error));

}


function checkIfValid(firstName, lastName, city, country, email, questions, answers, category) {
    if (firstName === undefined) return false;
    if (lastName === undefined) return false;
    if (city === undefined) return false;
    if (country === undefined) return false;
    if (email === undefined) return false;
    if (questions === undefined) return false;
    if (answers === undefined) return false;
    return category !== undefined;

}