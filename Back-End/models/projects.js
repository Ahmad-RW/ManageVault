const mongoose = require('mongoose')
const schema = mongoose.Schema;

const projectsSchema = new schema({
    title :{
        type: String,
        required :true
    },
    creator : {
        type : String
    },
    major_course : { type : String },
    status : {
        type : String,
        enum : ['PENDING', 'RUNNING', 'PUBLISHED', 'STOPPED'],
        required : true
    },
    votes: {
        yes : Number,
        no : Number
    },
    displayStyle: {
        type : String,
        enum : ['TABLE', 'TIMELINE']
    },
    roles :{
        TeamManager : {type : Array, default: ["INVITE_USERS", "REMOVE_TEAM_MEMBERS", "PUBLISH_PROJECT", "UNPUBLISH_PROJECT"]},
        TaskManager : {type : Array, default:  ["CREATE_TASK", "CONFIRM_SUBMISSION", "DELETE_TASK", "ASSIGN_TASK", "UN-ASSIGN_TASK", "MODIFY_TASK"]},
    },
    members : [{
        email : String,
        name : String,
        teamLeader : Boolean,
        kind : String,
        authorities : [],//roles : {task mng: true, team mng: false}
    }],
    files : [{
        name : {type : String},
        extension : String,
        size : String,
        lasModified : String,
        creator : String,
    }],
    tasks : [{
        name : String,
        // status : String,
        // startDate : Date, //we calculate the deadline given startdate and duration
        // duration : Number, // we need to find integers in react OR handle entering floats as days. 
        // deadline : Date, //String or Date ? 
        // dependencies : [{
        //     Date : Date,
        //     predecessor : String,
        //     successor : String
        // }]
    //     channel : {
    //         name : String,
    //         messages :[{
    //             date : Date,
    //             content : Object,   //handle if its a only a string in the back end. if thats the case convert it using JSON.parse
    //             author : String
    //         }]
    //     },
    //     assignment : {
    //         assigner : String,
    //         assignedMembers : [{name : String}],
    //         startDate : Date,
    //         endDate : Date
    //     },
    //     comments : [{
    //         date : Date,
    //         content : String,
    //         author : String
    //     }],
    //     activity : [{
    //         name : String,
    //         status : {type : String, enum :['CHECKED', 'UNCHECKED']},
    //         date : Date
    //     }],
    //     inputFiles: [{name : String}],
    //     outputFiles: [{name : String}],
    //     attachments : [{name : String}]
    // }]
    }]
}) 

const Projects = mongoose.model('projects', projectsSchema)

module.exports = Projects
