const express = require('express');
const projectRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')
const users = require('../models/users');
const Chatkit = require('@pusher/chatkit-server')

const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:284bc324-9274-4bee-b49f-efd146384063",
    key: "8e5a1191-4999-417c-87e3-a2ccb54c775b:EgBlYSiXIv9TFfqSM/cQxO9ECOR5jXhemLqcHCwNrhE="
})

projectRoute.post('/newproject', function (req, res) {
    chatkit.createRoom({
        creatorId: "ManageVault",
        name: req.body.project.title,
    }).then(function(response){
        let id=response.id
        console.log(req.body, "REQUEST")
    let project = {
        title: req.body.project.title,
        chatRoomId: id, 
        creator: req.body.project.creator,
        major_course: req.body.project.major_course,
     
        status: 'RUNNING',
        votes: {
            yes: 0,
            no: 0
        },
        members: req.body.project.members
    }
    let invitedMembers = req.body.project.invitedMembers.replace(/\s/g, '')//remove all spaces so when we match names we don't include spaces (e.g. test@test.com,test2@test.com)
    invitedMembers = invitedMembers.split(',')//basically split the string at the commas and return each section as an element in an array.
    console.log(invitedMembers, "INVITED MEMBERS")
    invitedMembers = invitedMembers.filter(function (member) { return member !== req.body.userInfo.email })
    console.log(invitedMembers, "INVITED MEMBERS AFTER FILTERING")
    projects.create(project).then(function (project) {
        res.status(200).send(project)
        handleInvite(invitedMembers, project)
    }).catch(function (error) {
        console.log(error)
        res.status(500)
    });
        console.log(response.id)
    }).catch(function(err){
        console.log(err)
    })
    
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

projectRoute.post('/deleteproject', function (req, res) {

    mongoose.model("projects").findByIdAndUpdate(req.body.project._id, {"status" : "STOPPED"}).then(function(record){
        res.status(200).send(record)
    }).catch(function(exception){
        res.status(500).send(exception)
    })
})

projectRoute.post('/requestDeleteProject', function (req, res) {
    console.log(req.body, "PROJECT")
    mongoose.model("projects").findByIdAndUpdate(req.body.project._id, { $set: { "status": "PENDING" }, $inc: { "votes.yes": 1 } }, {runValidators: true}).then(function (record) {
        console.log(record)
        handleRequest(req.body.project)
        res.status(200).send(record)

    }).catch(function (error) {
        res.status(500).send(error)
    })
})

projectRoute.post('/handleVoting', function (req, res) {//payload
    mongoose.model("projects").findById(req.body.payload.projectId).then(function (record) {
        if (req.body.payload.yes) {
            mongoose.model("projects").findByIdAndUpdate(record._id, { $inc: { "votes.yes": 1 } }, ).then(function (record) {//thiss is the record before changing
                var Previousvotes = record.votes.yes;
                Previousvotes++
                console.log(Previousvotes)
                var majority = record.members.length / 2
                console.log(majority, "Majority")
                if (Previousvotes > majority) {
                    console.log("Inside if")
                    mongoose.model("projects").findByIdAndDelete(req.body.payload.projectId).then(function (record) {
                        console.log(record, "DELETE QUERY")
                    })
                    mongoose.model("users").findByIdAndUpdate(req.body.payload.userInfo._id, { $pull: { "notifications": { _id: req.body.payload.notification._id } } }).then(function (record) {
                        console.log(record, "RECOOOORD")
                    }
                    )
                }
            })
        } else {
            mongoose.model("projects").findByIdAndUpdate(record._id, { $inc: { "votes.no": 1 } }).then(function (record) {
                var Previousvotes = record.votes.no
                Previousvotes++
                var majority = record.members.length / 2
                if (Previousvotes >= majority) {
                    console.log("inside if No Vote")
                    mongoose.model("projects").findByIdAndUpdate(req.body.payload.projectId, { $set: { "status": "RUNNING" } }).then(function (record) {
                        console.log(record, "CHANGED STATUS")
                    })
                    mongoose.model("users").findByIdAndUpdate(req.body.payload.userInfo._id, { $pull: { "notifications": { _id: req.body.payload.notification._id } } }).then(function (record) {
                        console.log(record, "deleted notification")
                    })
                }
            }).catch(function (exception) {
                console.log("EXCEPTION OCCURED")
                console.log(exception)
            })
        }
        res.sendStatus(200)
    }).catch(function (error) {
        console.log(error)
    })

})

projectRoute.post('/leaveProject', function (req, res) {
    // console.log(req.body)
    mongoose.model('projects').findByIdAndUpdate(req.body.project._id, { $pull: { "members": { email: req.body.userInfo.email } } }).then(function (record) {
        if (record.members.length === 1) {//delete the project if the last member leaves it. RIP 
            mongoose.model('projects').findByIdAndDelete(req.body.project._id).then(function (record) {
                console.log(record)
            }).catch(function (exception) {
                console.log(exception)
            })
        }
        res.status(200).send(record)
    }).catch(function (exception) {
        console.log(exception)
    })
})
projectRoute.post('/removeTeamMember', function (req, res) {
    console.log(req.body.project)
    mongoose.model("projects").findByIdAndUpdate(req.body.project._id, { $pull: { "members": { _id: req.body.member._id } } }).then(function (record) {
        console.log(record, "this is the member we removed")
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
})
projectRoute.post('/handleInvite', function (req, res) {
    console.log(req.body.project)
    const member = {
        email: req.body.userInfo.email,
        name: req.body.userInfo.name,
        teamLeader: false,
        kind: "ACTIVE",
        authorities: []
    }
    // mongoose.model("projects").findById(req.body.project).then(function(record){

    // }).catch(function(exception){

    // })
    mongoose.model("projects").findByIdAndUpdate(req.body.project, { $push: { "members": member } }).then(function (record) {//handles accepting invite. First it pushess themmeber in the project then removes the notification from his mailbox
        mongoose.model("users").findByIdAndUpdate(req.body.userInfo._id, { $pull: { "notifications": { _id: req.body.notification._id } } }).then(function (record) {
            mongoose.model('projects').findById(req.body.project).then(function (record) {
                const data = {projectID:req.body.project,newTM:member, project:record}
                sendNotification("NEW_TEAM_MEMBER", data)
            })
            // console.log(record)
            res.status(200).send(record)
        })
    }).catch(function (err) {
        console.log(err)
    })

})

projectRoute.post('/handleNotificationDelete', function (req, res) {
    console.log(req.body)
    mongoose.model('users').findByIdAndUpdate(req.body.userInfo._id, { $pull: { "notifications": { _id: req.body.notification._id } } }).then(function (record) {
        console.log(record)
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
})

projectRoute.post('/newRole', function(req, res){
    console.log(req.body)
    mongoose.model('projects').findByIdAndUpdate(req.body.payload.project._id, {$push :{"definedRoles" : req.body.payload.role}}, {new : true, runValidators: true}).then((record)=>{
        console.log(record)
        res.status(200).send(record)
    }).catch((exception)=>{
        console.log(exception)
    })
})

projectRoute.post('/setAuthority', function (req, res) {
    console.log(req.body.payload)
    mongoose.model('projects').findByIdAndUpdate(req.body.payload.project._id, 
        { $set: { "members.$[elem].roles": req.body.payload.newRoles } }, 
        { arrayFilters: [{ "elem.email": req.body.payload.member.email }], new:true}).then(function(record) {
        console.log(record)
        res.status(200).send(record)
    }).catch(function (exception) {
        console.log(exception)
        res.status(500).send()
    })
})

projectRoute.post('/revokeAuthorities', function(req, res){
    console.log(req.body)
    mongoose.model('projects').findByIdAndUpdate(req.body.payload.project._id, 
        { $set: { "members.$[elem].roles":req.body.payload.newRoles } }   ,
        { arrayFilters: [{ "elem.email": req.body.payload.member.email }], new:true } ).then(function(record){
            console.log(record)
            res.status(200).send(record)
        }).catch(function(exception){
            console.log(exception)
            res.status(500).send(exception)
        })
})

projectRoute.post('/assignNewTeamLeader', function(req, res){
    console.log(req.body)
    mongoose.model('projects').findByIdAndUpdate(req.body.payload.project._id, 
     {$set:{"members.$[elem].teamLeader" : false}},
     {arrayFilters :[{"elem.teamLeader" : true}]}).then(function(){
         mongoose.model('projects').findByIdAndUpdate(req.body.payload.project._id, 
            {$set :{"members.$[elem].teamLeader" : true}},
          {arrayFilters : [{"elem.email" : req.body.payload.memberEmail}], new: true}
         ).then(function(record){
             console.log(record)
             res.status(200).send(record)
         }).catch(function(exception){
            console.log(exception)
            res.status(500).send(exception)
         })
     }).catch(function(exception){
         console.log(exception)
         res.status(500).send(exception)
     })
})

projectRoute.post('/inviteUsers', function (req, res) {
    let invitedMembers = req.body.payload.invitedUsers.replace(/\s/g, '')//remove all spaces so when we match names we don't include spaces (e.g. test@test.com,test2@test.com)
    invitedMembers = invitedMembers.split(',')//basically split the string at the commas and return each section as an element in an array.
    invitedMembers = invitedMembers.filter(function (member) { return member !== req.body.payload.userInfo.email })
    const record = handleInvite(invitedMembers, req.body.payload.project)
    res.status(200).send(record)
})

projectRoute.get('/findUsers', function (req, res) {
    console.log(req.query,"finding")
    const query = req.query.searchQuery
    console.log(query,"query")
    queryE = new RegExp(query,"i")
    console.log(queryE,"Regular expression")
    mongoose.model('users').find( { email: queryE }).then(function (record) {
        // console.log(record)
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
    })
})

function helper(){
    return 0
}

//helper functions
function handleInvite(invitedMembers, project) {//basically this function sends a notification to the users who are invited to a project. It's been refactored due to size.
    const obj = { kind: "PROJECT_INVITE", date: new Date, data: { title: project.title, creator: project.creator, projectId: project._id } }
    invitedMembers.forEach(member => {

        mongoose.model('users').findOne({ "notifications.data.projectId": project._id }).then(function (record) {
            console.log(record, "HEREHRERHEREHRE")
            if (record === null) {
                mongoose.model('users').findOneAndUpdate({ email: member }, { $push: { "notifications": obj } }).then(function (record) {
                    console.log(record, "record")
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }).catch(function (exception) {
            console.log(exception)
        })

    })
}

function handleRequest(project) {  //Takes the members who will recieve the request and the project to delete.
    const obj = { kind: "DELETE_VOTE", date: new Date, data: { title: project.title, creator: project.creator, projectId: project._id } }
    project.members.forEach(member => {
        if (!member.teamLeader) {
            mongoose.model('users').findOneAndUpdate({ email: member.email }, { $push: { "notifications": obj } }).then(function (record) {
                console.log("Notificatoin sent")
            }).catch(function (error) {
                console.log(error);
            })
        }
    })
}

function  sendNotification(kind, data) {
    let notification={}
    if(kind === "NEW_TEAM_MEMBER"){
        notification = {
            kind: "NEW_TEAM_MEMBER",
            date: new Date,
            data: {projectID: data.project._id,
                    project_title:data.project.title,
                    newTM: data.newTM
                }
        }
        console.log(notification)
        data.project.members.forEach(function(member){
            if(member.email === data.newTM.email){
                return
            }
            console.log(member.email)
            mongoose.model("users").findOneAndUpdate({ email: member.email}, { $push: { "notifications":  notification}} ).then(function (record) {
                console.log(record,"Notificatoin sent to members")
            }).catch(function (error) {
                console.log(error)
            })
        })
    }

}
// function findProject(project){
//     mongoose.model('projects').findById(project).then(function (record) {
//         return record
//     }).catch(function (exception) {
//         console.log(exception)
//     })
// }
module.exports = projectRoute