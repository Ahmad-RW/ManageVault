const express = require('express');
const taskRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')

taskRoute.post('/newTask', function (req, res) {
    console.log(req.body.payload.project,"this is the project")
    console.log(req.body.payload.task,"i am in  task routes")
    let task = {
        name: req.body.payload.task.name,
    }
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project, {$push :{"tasks" : task}}).then(function(record){
        // console.log(record)
        res.status(200).send(record)
    }).catch(function(err){
        console.log(err)
    })
});

module.exports = taskRoute