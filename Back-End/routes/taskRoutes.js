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
    //     console.log(req.body)
    //     const predecessorTasks = normalize(req.body.payload.predecessors)
    //     const successorTasks = normalize(req.body.payload.successor)
    //     const newPredTasks = req.body.payload.task.dependencies.predecessor.concat(predecessorTasks)
    //     const newSuccTasks = req.body.payload.task.dependencies.successor.concat(successorTasks)
    //     mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,
    //         {$set:{"tasks.$[elem].dependencies.predecessor": newPredTasks,
    //         "tasks.$[elem].dependencies.successor" : newSuccTasks}},
    //         {arrayFilters: [{"elem._id" : mongoose.Types.ObjectId(req.body.payload.task._id)}], new: true}).then(function(record){
    //             console.log(record)
    //             res.status(200).send(record)
    //         }).catch(function(exception){
    //             res.status(500).send(exception)
    console.log(req.body.payload)
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,
        {$push:{"tasks.$[taskInContext].dependencies.predecessor" :req.body.payload.predecessorTask.name,
        "tasks.$[predecessorTask].dependencies.predecessorTo":req.body.payload.taskInContext.name }},
        {arrayFilters : [{"taskInContext._id":mongoose.Types.ObjectId(req.body.payload.taskInContext._id)},
                         {"predecessorTask._id":mongoose.Types.ObjectId(req.body.payload.predecessorTask._id)}
                        ], new:true}
        ).then(function(record){
            console.log(record)
            res.status(200).send(record)
        }).catch(function(exception){
            console.log(exception)
            res.status(500).send(exception)
        })


})


taskRoute.post('/submitTask', function (req, res) {
    console.log(req.body)
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].status": "PENDING_FOR_CONFIRMATION" } },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})

taskRoute.post('/confirmTaskSubmission', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].status": "SUBMITTED" } },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})

taskRoute.post('/editTask', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {
        $set: {
            "tasks.$[elem].name": req.body.payload.name,
            "tasks.$[elem].description": req.body.payload.description,
            "tasks.$[elem].startDate": req.body.payload.startDate,
            "tasks.$[elem].duration": req.body.payload.duration
        }
    }, { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
        console.log(record, "edit task")
        res.status(200).send(record)
    }).catch(function (err) {
        res.status(500).send(err)
    })
});

taskRoute.post('/assignTask', function (req, res) {
    assignedMember = {
        name : req.body.payload.member.name,
        email : req.body.payload.member.email
    }
    console.log(assignedMember,"here")
    newAssignedMembers = [...req.body.payload.task.assignment.assignedMembers, assignedMember]
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,{ $set: { "tasks.$[elem].assignment.assignedMembers": newAssignedMembers } }
    ,{arrayFilters :[{"elem._id" :mongoose.Types.ObjectId(req.body.payload.task._id)}] , new: true }).then(function (record) {
        console.log(record,"assign task")
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
});

taskRoute.post('/newActivity', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $push: { "tasks.$[elem].activities": req.body.payload.activity } },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
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

taskRoute.post('/unAssignTask', function(req, res){
    const assignedMembers = req.body.payload.task.assignment.assignedMembers
    const newAssignedMembers = assignedMembers.filter(member => {return member.email !== req.body.payload.member.email})
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,{ $set: { "tasks.$[elem].assignment.assignedMembers": newAssignedMembers } }
    ,{arrayFilters :[{"elem._id" :mongoose.Types.ObjectId(req.body.payload.task._id)}] , new: true }).then(function (record) {
        console.log(record,"Unassign task")
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
})

taskRoute.post('/watchTask', function(req, res){
    const newWatchedMembers = [...req.body.payload.task.watchedBy, req.body.payload.member.email]
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,{ $set: { "tasks.$[elem].watchedBy": newWatchedMembers } }
    ,{arrayFilters :[{"elem._id" :mongoose.Types.ObjectId(req.body.payload.task._id)}] , new: true }).then(function (record) {
        console.log(record,"watch task")
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
})

taskRoute.post('/unWatchTask', function(req, res){
    const watchedMembers = req.body.payload.task.watchedBy
    const newWatchedMembers = watchedMembers.filter(email => {return email !== req.body.payload.member.email})
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,{ $set: { "tasks.$[elem].watchedBy": newWatchedMembers } }
    ,{arrayFilters :[{"elem._id" :mongoose.Types.ObjectId(req.body.payload.task._id)}] , new: true }).then(function (record) {
        console.log(record,"unwatch task")
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
})

taskRoute.post('/handleOutput', function(req, res){
    const outputFile = req.body.payload.outputFile
    console.log(outputFile,"ghghghhghgghh")
    const newoutputFiles = [...req.body.payload.task.outputFiles, outputFile]
    console.log(newoutputFiles,"newoutputFiles")
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,{ $set: { "tasks.$[elem].outputFiles": newoutputFiles } }
    ,{arrayFilters :[{"elem._id" :mongoose.Types.ObjectId(req.body.payload.task._id)}] , new: true }).then(function (record) {
        // console.log(record,"output file")
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
})
//helper function
function normalize(text) {
    text = text.replace(/\s/g, '');
    text = text.split(',')
    return text
}
module.exports = taskRoute