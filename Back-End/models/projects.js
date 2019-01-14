const mongoose = require('mongoose')
const schema = mongoose.Schema;

const projectsSchema = new schema({
    name :{
        type: String,
        required :true
    },
    course : {
        type : String,
        required : true
    },
    major : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['PENDING', 'RUNNING', 'PUBLISHED'],
        required : true
    },
    displayStyle: {
        type : String,
        enum : ['TABLE', 'TIMELINE']
    },
    members : [{
        name : String,
        kind : String,
        authorities : []
    }],
    files : [{
        name : String,
        extension : String,
        size : String,
        lasModified : String,
        creator : String,
    }],
    tasks : [{
        name :{type : String, required: true},
        status : String,
        deadline : String,
        dependencies : [{
            startDate : Date,
            endDate : Date,
            predecessor : String,
            successor : String
        }],
        channel : {
            name : String,
            messages :[{
                date : Date,
                content : String,
                author : String
            }]
        },
        assignment : {
            assigner : String,
            assignedMembers : [{name : String}],
            date : Date,
        },
        comments : [{
            date : Date,
            content : String,
            author : String
        }],
        activity : [{
            name : String,
            status : {type : String, enum :['CHECKED', 'UNCHECKED']},
            date : Date
        }],
        inputFiles: [{name : String}],
        outputFiles: [{name : String}],
        attachments : [{name : String}]
    }]
}) 

const Projects = mongoose.model('projects', projectsSchema)

module.exports = Projects
