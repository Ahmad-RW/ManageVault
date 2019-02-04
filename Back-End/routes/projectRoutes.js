const express = require('express');
const projectRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')

projectRoute.post('/newproject', function (req, res) {
    let project = {
        title: req.body.project.title,
        creator: req.body.project.creator,
        major_course: req.body.project.major_course,
        status: 'RUNNING',
        votes : 0,
        members: req.body.project.members
    }
    let invitedMembers = req.body.project.invitedMembers.replace(/\s/g,'')//remove all spaces so when we match names we don't include spaces (e.g. test@test.com,test2@test.com)
    invitedMembers = invitedMembers.split(',')//basically split the string at the commas and return each section as an element in an array.
    projects.create(project).then(function (project) {
        res.status(200).send(project)
        handleInvite(invitedMembers, project)
    }).catch(function (error) {
        console.log(error)
        res.status(500)
    });
});
projectRoute.get('/getUserProjects', function (req, res) {
    mongoose.model('projects').find({ "members.email": req.query.userEmail },
        function (err, userProjects) {
            if (err) {
                res.status(500)
            }
            res.status(200).send(userProjects)
        })
});

projectRoute.post('/deleteproject', function (req,res) {
    console.log(req.body)
    mongoose.model('projects').findByIdAndDelete(req.body.project._id).then(function (err,record) {
        console.log(record)
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
        res.status(500)
    })
})

projectRoute.post('/requestDeleteProject', function (req, res) {
    console.log(req.body, "PROJECT")
    let votes = 1;
    mongoose.model("projects").findByIdAndUpdate(req.body.project._id, {$set :{"status":"PENDING", "votes": votes}}).then(function(record){
        console.log(record)
        handleRequest(req.body.project)
        res.status(200).send(record)

    }).catch(function(error){
        res.status(500).send(error)
    })
})

projectRoute.post('/handleVoting', function(req, res) {//payload
    console.log(req.body, "BODY")
    mongoose.model("projects").findById(req.body.payload.projectId).then(function(record){
        console.log(record, "THIS IS THE RECORD");
        let votes = record.votes; // Get hold of the votes from the DB.
        if(req.body.payload.yes){
            votes++;
            mongoose.model("projects").findByIdAndUpdate(record._id,{$set :{"votes":votes}}).then(function(record){
                var votes = record.votes;
                console.log(votes)
                votes++
                console.log(votes)
                var majority = record.members.length/2
                console.log(majority, "Majority")
                if (votes >= majority){
                    console.log("Inside if")
                    mongoose.model("projects").findByIdAndDelete(req.body.payload.projectId).then(function(record){
                        console.log(record, "DELETE QUERY")
                    })
                    mongoose.model("users").findByIdAndUpdate(req.body.payload.userInfo._id, {$pull : {"notifications" : {_id: req.body.payload.notification._id}}}).then(function(record){
                        console.log(record, "RECOOOORD")
                    }
                )}
            })
        }else{
            console.log("DECLINED DELETE")
            
        }
        res.sendStatus(200)
    }).catch(function(error){
        console.log(error)
    })
    
})

projectRoute.post('/leaveProject', function(req, res){
   // console.log(req.body)
    mongoose.model('projects').findByIdAndUpdate(req.body.project._id, {$pull : { "members" : {email : req.body.userInfo.email} }}).then(function(record){
       if(record.members.length === 1){//delete the project if the last member leaves it. RIP 
           mongoose.model('projects').findByIdAndDelete(req.body.project._id).then(function(record){
               console.log(record)
           }).catch(function(exception){
               console.log(exception)
           })
       }
        res.status(200).send(record)
    }).catch(function(exception){
        console.log(exception)
    })
})
projectRoute.post('/removeTeamMember', function (req, res) {
    console.log(req.body.project)
    mongoose.model("projects").findByIdAndUpdate(req.body.project._id, {$pull : {"members" : {_id : req.body.member._id}}}).then(function(record){
        console.log(record,"this is the member we removed")
        res.status(200).send(record)
    }).catch(function(err){
        console.log(err)
    })
})
projectRoute.post('/handleInvite', function (req, res) {
    console.log(req.body.project)
    const member = {
        email : req.body.userInfo.email,
        teamLeader : false,
        kind : "ACTIVE",
        authorities : []
    }
    mongoose.model("projects").findByIdAndUpdate(req.body.project, {$push :{"members" : member}}).then(function(record){//handles accepting invite. First it pushess themmeber in the project then removes the notification from his mailbox
        mongoose.model("users").findByIdAndUpdate(req.body.userInfo._id, {$pull : {"notifications" : {_id : req.body.notification._id}}}).then(function(record){
            // console.log(record)
            res.status(200).send(record)
         })
    }).catch(function(err){
        console.log(err)
    })
    
})
projectRoute.post('/handleNotificationDelete', function(req, res){
    console.log(req.body)
    mongoose.model('users').findByIdAndUpdate(req.body.userInfo._id, {$pull : {"notifications" :{_id : req.body.notification._id}}}).then(function(record){
        console.log(record)
        res.status(200).send(record)
    }).catch(function(err){
        console.log(err)
    })
})

//helper functions
function handleInvite(invitedMembers, project) {//basically this function sends a notification to the users who are invited to a project. It's been refactored due to size.
    console.log("inside helper function")
    const obj = {kind : "PROJECT_INVITE", date : new Date, data : { title : project.title , creator : project.creator, projectId :  project._id}}
    console.log(obj, "single notification")
    invitedMembers.forEach(member => {
        console.log(member)
        mongoose.model('users').findOneAndUpdate({email : member}, {$push :{"notifications" : obj}}).then(function(record){
            console.log(record, "record")
        }).catch(function(error){
            console.log(error)
        })
    })
}

function handleRequest(project) {  //Takes the members who will recieve the request and the project to delete.
   const obj = {kind: "DELETE_VOTE", date: new Date, data : { title : project.title , creator : project.creator, projectId :  project._id}}
   project.members.forEach(member => {
       if(!member.teamLeader){
       mongoose.model('users').findOneAndUpdate({email: member.email}, {$push: {"notifications" : obj}}).then(function(record){
           console.log("Notificatoin sent")
       }).catch(function(error){
            console.log(error);
       })
    }
   })
}

module.exports = projectRoute