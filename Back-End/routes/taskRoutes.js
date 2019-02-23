const express = require('express');
const taskRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')

taskRoute.post('/newTask', function (req, res) {
    console.log(req.body.payload.project,"this is the project")
    console.log(req.body.payload.task,"i am in  task routes")
    let task = {
        name: req.body.payload.task.name,
        description: req.body.payload.task.Description,
        status : req.body.payload.task.status,
        startDate : req.body.payload.task.startDate,
        duration : req.body.payload.task.duration,
    }
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project, {$push :{"tasks" : task}}, {new: true}).then(function(record){
        console.log(record)
        res.status(200).send(record)
    }).catch(function(err){
        console.log(err)
    })
});


taskRoute.post('/deleteTask', function (req, res) {
    console.log(req.body.payload, ", ReqBody")
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.PID, {$pull :{"tasks" : {"_id" : req.body.payload.task_id}}}, {new: true}).then(function(record){
        console.log(record, "RECORD")
        res.status(200).send(record)
    }).catch(function(err){
        console.log(err)
    })
});

taskRoute.post('/newComment', function(req, res){
    console.log(req.body)
    newComments = [...req.body.payload.task.comments, req.body.payload.comment]
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, 
        {$set : {"tasks.$[elem].comments": newComments }},
          {arrayFilters :[{"elem._id" : mongoose.Types.ObjectId(req.body.payload.task._id)}], new : true }).then(function(record){
              console.log(record)
              res.status(200).send(record)
          }).catch(function(exception){
              console.log(exception)
          })
   
   
   
   
   
   
   
   
   
    
    // mongoose.model('projects').findByIdAndUpdate({"_id" : req.body.payload.project._id, "tasks._id" : req.body.payload.task._id}, {$push :{"tasks.$.comments":req.body.payload.comment}}).then(function(record){
    //     console.log(record)
    // }).catch(function(exception){
    //     console.log(exception)
    // })
})

module.exports = taskRoute