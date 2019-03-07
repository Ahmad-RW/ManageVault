const mongoose = require('mongoose')
const schema = mongoose.Schema;

const authoritySchema = new schema({
    authority: {
        type: String,
        enum: ["INVITE_USERS", "REMOVE_TEAM_MEMBERS", "PUBLISH_PROJECT", "UNPUBLISH_PROJECT",
            "CREATE_TASK", "CONFIRM_SUBMISSION", "DELETE_TASK",
            "ASSIGN_TASK", "UN-ASSIGN_TASK", "MODIFY_TASK"]
    }
},
    { _id: false });
const rolesSchema = new schema({
    name: String,
    authorities: [{
        type: String,
        enum: ["INVITE_USERS", "REMOVE_TEAM_MEMBERS", "PUBLISH_PROJECT", "UNPUBLISH_PROJECT",
            "CREATE_TASK", "CONFIRM_SUBMISSION", "DELETE_TASK",
            "ASSIGN_TASK", "UNASSIGN_TASK", "MODIFY_TASK"]
    }]
})
const projectsSchema = new schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: String
    },
    major_course: { type: String },
    status: {
        type: String,
        enum: ['PENDING', 'RUNNING', 'PUBLISHED', 'STOPPED'],
        required: true
    },
    votes: {
        yes: Number,
        no: Number
    },
    displayStyle: {
        type: String,
        enum: ['TABLE', 'TIMELINE']
    },
    definedRoles: [rolesSchema],
    members: [{
        email: String,
        name: String,
        teamLeader: Boolean,
        kind: String,
        roles: [rolesSchema],//roles : {task mng: true, team mng: false}
    }],
    documents: [{
        name: { type: String },//logical
        extension: String,
        size: String,
        lasModified: String,
        creator: String,
        file: String ,//Uniform Resource Locator,
        fileName : String,//physical
        storageReference : String//name in firebase storage. I put it as reference we might not even need it
    }],
    tasks: [{
        name: String,
        status: {
            type: String,
            enum: ["TO_DO", "PENDING_FOR_CONFIRMATION", "SUBMITTED"]
        },
        field: String,
        description: String,
        startDate: Date, //we calculate the deadline given startdate and duration
        duration: Number, // we need to find integers in react OR handle entering floats as days. 
        submissionCriteria : String,
        dependencies: {
            Date: Date,
            predecessor: [{
                taskName: String,
                taskId: String
            }],
            predecessorTo: [{
                taskName: String,
                taskId: String
            }],
            //successor: [String]
        },
        //     channel : {
        //         name : String,
        //         messages :[{
        //             date : Date,
        //             content : Object,   //handle if its a only a string in the back end. if thats the case convert it using JSON.parse
        //             author : String
        //         }]
        //     },
        assignment: {
            assigner: String,
            assignedMembers: [{
                name: String,
                email: String
            }],
            startDate: Date,
            endDate: Date
        },
        watchedBy: [String],
        comments: [{
            date: Date,
            content: String,
            author: String
        }],
        activities: [{
            name: String,
            status: { type: String, enum: ['CHECKED', 'UNCHECKED'] },
            date: Date
        }],
        inputDocuments: [{
            name:String,
            fileName: String,
            file: String,
            storageReference : String
        }],
        outputDocuments: [{
            name:String,
            fileName: String,
            file: String,
            storageReference : String
        }],
        //     attachments : [{name : String}]
        // }]
    }]
})

const Projects = mongoose.model('projects', projectsSchema)

module.exports = Projects
