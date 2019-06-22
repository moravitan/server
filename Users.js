const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
const DButilsAzure = require('./DButils');

const key = "YuvalMor";

const categories = ["Night life", "Museums", "Food and Drinks", "Sailing and water sports"];
const countries = ["Australia", "Bolivia", "China", "Denemark", "Israel", "Latvia", "Monaco", "August", "Norway", "Panama", "Switzerland", "USA"];

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
    var userName = req.body.user_name;
    var password = req.body.password;
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var city = req.body.city;
    var country = req.body.country;
    var email = req.body.email;
    var questions = req.body.questions;
    var answers = req.body.answers;
    var category = req.body.interest;
    if (!checkIfValid(userName, password, firstName, lastName, city, country, email, questions, answers, category) || !countries.includes(country)) {
        res.sendStatus(400);
    } else {
        var sql = "INSERT INTO Users ([user_name], [password],[first_name], [last_name], [city], [country], [email]) VALUES ('" + userName + "', '" + password + "', '" + firstName + "', '" + lastName + "', '" + city + "', '" + country + "', '" + email + "')";
        DButilsAzure.insert(sql)
            .then(function (result) {
            })
            .catch(function (err) {
                isValidRequest = false;
                console.log(err);
            });
        for (let i = 0; i < category.length; i++) {
            if (!categories.includes(category[i])) {
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

        if (questions.length !== answers.length || questions.length < 2) {
            isValidRequest = false;
        }

        if (!isValidRequest) {
            res.sendStatus(400);
        } else {
            for (let i = 0; i < questions.length && isValidRequest; i++) {
                sql = "INSERT INTO UsersQuestion (user_name, question, answer) VALUES ('" + userName + "','" + questions[i] + "', '" + answers[i] + "')";
                DButilsAzure.insert(sql).then(function (result) {
                })
                    .catch(function (err) {
                        cancel(userName,'UsersQuestions');
                        isValidRequest = false;
                        console.log(err);
                        res.send(err);
                    });
            }
            if (isValidRequest) {
                var details = {"user_name": userName, "password": password};
                res.send(details);
            }
            else{
                res.sendStatus(400);
            }
        }
    }
};

exports.getPassword = function (req, res) {
    try {
        var userName = req.body.user_name;
        var question = req.body.question;
        var answer = req.body.answer;
        var sql = "SELECT Users.password FROM UsersQuestion join Users " +
            "on Users.user_name = UsersQuestion.user_name where UsersQuestion.user_name = '" + userName + "' " +
            "and UsersQuestion.question = '" + question + "' and UsersQuestion.answer = '" + answer + "'";
        DButilsAzure.execQuery(sql)
            .then(function (result) {
                if (Object.keys(result).length > 0) {
                    res.send(result[0].password);
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

exports.getQuestions = function(req, res) {
    var sql = "SELECT * from Questions";
    DButilsAzure.execQuery(sql).then(result => res.send(result)).catch(error => console.log(error));
};

exports.getUserQuestion = function(req, res) {
    var userName = req.params.user_name;
    var sql = "SELECT question from UsersQuestion WHERE user_name = '"+userName+"'";
    DButilsAzure.execQuery(sql).then(function (result) {
        res.send(result);
    }).catch(error => res.sendStatus(400))
};

function cancel(userName, table) {
    var sql = "DELETE from '"+table+"' where user_name = '" + userName + "'";
    DButilsAzure.execQuery(sql).then().catch(error => console.log(error));

}


function checkIfValid(userName, password, firstName, lastName, city, country, email, questions, answers, category) {
    if (userName === undefined || !checkString(userName,false,/^[A-za-z]+$/)) return false;
    if (password === undefined || !checkString(password, true,/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) return false;
    if (firstName === undefined) return false;
    if (lastName === undefined) return false;
    if (city === undefined) return false;
    if (country === undefined) return false;
    if (email === undefined) return false;
    if (questions === undefined) return false;
    if (answers === undefined) return false;
    return category !== undefined;

}



function checkString(string, isPassword, pattern){
    var isValid = pattern.test(string);
    if (isPassword)
        return isValid && string.length > 4 && string.length < 11;
    else
        return isValid && string.length > 2 && string.length < 9;
}
