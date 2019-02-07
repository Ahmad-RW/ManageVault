const mongoose = require('mongoose')
const schema = mongoose.Schema;

const usersSchema = new schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    notifications : [{
        kind : String,
        date : Date,
        data : {}
    }]
});

const Users = mongoose.model('users', usersSchema)

module.exports = Users

