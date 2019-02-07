const express = require('express');
const userRoute = express.Router()
const users = require('../models/users');
const mongoose = require('../dbConfig/databaseCon')

userRoute.get('/getUserData', function (req, res) {
    mongoose.model('users').findOne({ email: req.query.userEmail },
        function (err, userInfo) {
            if (err) {
                res.status(500)
            }
            res.status(200).send(userInfo)

        })
});


userRoute.post('/newuser', function (req, res) {
    console.log("in new user")
    users.create(req.body).then(function (user) {
        res.status(200).send(user)
    }).catch(function () {
        res.status(500)
    })
});

module.exports = userRoute