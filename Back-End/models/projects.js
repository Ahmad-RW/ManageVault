const mongoose = require('mongoose')
const schema = mongoose.Schema;


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
    chatRoomId :{
        type: String,
        default :"00000"
    },
    creator: {
        type: String
    },
    chatRoomId: String,
    major_course: { type: String },
    status: {
        type: String,
        enum: ['PENDING', 'RUNNING', 'PUBLISHED', 'STOPPED'],
        required: true
    },
    publishDate : {type: Date},
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
        contentType: String,
        size: String,
        lasModified: String,
        creator: String,
        file: String ,//Uniform Resource Locator,
        fileName : String,//physical
        storageReference : String,//name in firebase storage. I put it as reference we might not even need it
        relatedTasks : [String], // tasks IDs
        isImported : Boolean,
        hidden :{type:Boolean, default : false},
        deleted : {type:Boolean, default : false}
    }],
    tasks: [{
        name: String,
        status: {
            type: String,
            enum: ["TO_DO", "PENDING_FOR_CONFIRMATION", "SUBMITTED"]
        },
        field: String,
        description: String,
        feedback : String,
        test : String,
        startDate: Date,
        endDate: Date,
        duration: Number, // we need to find integers in react OR handle entering floats as days. 
        submissionCriteria : [String],
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
        },
        //     channel : {
        //         name : String,
        //         messages :[{
        //             date : Date,
        //             content : Object,   //handle if its a only a string in the back end. if thats the case convert it using JSON.parse
        //             author : String
        //         }]
        //     },
        assignedMembers: [{
            assigner: String,
            name: String,
            email: String,
            startDate: Date  
        }],
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
            contentType: String,
            fileName: String,
            file: String,
            storageReference : String,
            deleted : {type:Boolean, default : false},
            uploadedFromDisk :  {type:Boolean, default : false},
            isImported : {type:Boolean, default : false},
            outputOf : String
        }],
        outputDocuments: [{
            name:String,
            contentType: String,
            fileName: String,
            file: String,
            hidden :  {type:Boolean, default : false},
            deleted : {type:Boolean, default : false},
            storageReference : String
        }],
    }]
})

const Projects = mongoose.model('projects', projectsSchema)

module.exports = Projects
