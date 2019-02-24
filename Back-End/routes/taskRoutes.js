const express = require('express');
const taskRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')

taskRoute.post('/newTask', function (req, res) {
    console.log(req.body.payload.project, "this is the project")
    console.log(req.body.payload.task, "i am in  task routes")
    let task = {
        name: req.body.payload.task.name,
        description: req.body.payload.task.Description,
        status: req.body.payload.task.status,
        startDate: req.body.payload.task.startDate,
        duration: req.body.payload.task.duration,
    }
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project, { $push: { "tasks": task } }, { new: true }).then(function (record) {
        console.log(record)
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
});


taskRoute.post('/deleteTask', function (req, res) {
    console.log(req.body.payload, ", ReqBody")
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.PID, { $pull: { "tasks": { "_id": req.body.payload.task_id } } }, { new: true }).then(function (record) {
        console.log(record, "RECORD")
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
});

taskRoute.post('/newComment', function (req, res) {
    console.log(req.body)
    newComments = [...req.body.payload.task.comments, req.body.payload.comment]
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,
        { $set: { "tasks.$[elem].comments": newComments } },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})

taskRoute.post('/setDependancy', function (req, res) {
    console.log(req.body)
    const predecessorTasks = normalize(req.body.payload.predecessors)
    const successorTasks = normalize(req.body.payload.successor)
    const newPredTasks = req.body.payload.task.dependencies.predecessor.concat(predecessorTasks)
    const newSuccTasks = req.body.payload.task.dependencies.successor.concat(successorTasks)
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,
        {$set:{"tasks.$[elem].dependencies.predecessor": newPredTasks,
        "tasks.$[elem].dependencies.successor" : newSuccTasks}},
        {arrayFilters: [{"elem._id" : mongoose.Types.ObjectId(req.body.payload.task._id)}], new: true}).then(function(record){
            console.log(record)
            res.status(200).send(record)
        }).catch(function(exception){
            res.status(500).send(exception)
        })
})

taskRoute.post('/submitTask', function(req, res){
    console.log(req.body)
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {$set:{"tasks.$[elem].status" :  "PENDING_FOR_CONFIRMATION"}},
    {arrayFilters:[{"elem._id": mongoose.Types.ObjectId(req.body.payload.task._id)}], new:true}).then(function(record){
        console.log(record)
        res.status(200).send(record)
    }).catch(function(exception){
        res.status(500).send(exception)
    })
})

taskRoute.post('/confirmTaskSubmission', function(req, res){
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {$set:{"tasks.$[elem].status" : "SUBMITTED"}}, 
    {arrayFilters :[{"elem._id" :mongoose.Types.ObjectId(req.body.payload.task._id)}], new :true}).then(function(record){
        console.log(record)
        res.status(200).send(record)
    }).catch(function(exception){
        res.status(500).send(exception)
    })
})

taskRoute.post('/editTask', function (req, res) {
    const modifiedTask = {
        name: req.body.payload.name,
        description: req.body.payload.description,
        startDate: req.body.payload.startDate,
        duration: req.body.payload.duration,
    }
    console.log(modifiedTask, "+++++++++++++++++++++++++++++++++++++++")
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {
        $set:{
        "tasks.$[elem].name" : modifiedTask.name,
        "tasks.$[elem].description" : modifiedTask.description,
        "tasks.$[elem].startDate" : modifiedTask.startDate,
        "tasks.$[elem].duration" : modifiedTask.duration
        }
    },{arrayFilters :[{"elem._id" :mongoose.Types.ObjectId(req.body.payload.task._id)}] , new: true }).then(function (record) {
        console.log(record,"edit task")
        res.status(200).send(record)
    }).catch(function (err) {
        res.status(500).send(err)
    })
});

taskRoute.post('/newActivity', function(req, res){
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {$push : {"tasks.$[elem].activities":req.body.payload.activity}}, 
    {arrayFilters:[{"elem._id":mongoose.Types.ObjectId(req.body.payload.task._id)}], new:true}).then(function(record){
        console.log(record)
        res.status(200).send(record)
    }).catch(function(exception){
        res.status(500).send(exception)
    })
})
taskRoute.post('/checkActivity', function(req, res){
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {$set:{"tasks.$[elem].activities.$[activity].status":req.body.payload.status}},
    {arrayFilters : [{"elem._id" : mongoose.Types.ObjectId(req.body.payload.task._id)}, 
    {"activity._id" : mongoose.Types.ObjectId(req.body.payload.activity._id)}], new:true}).then(function(record){
        res.status(200).send(record)
    }).catch(function(exception){
        console.log(exception)
        res.status(500).send(exception)
    })
})
//helper function
function normalize(text) {
    text = text.replace(/\s/g, '');
    text = text.split(',')
    return text
}
module.exports = taskRoute