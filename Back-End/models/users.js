const mongoose = require('mongoose')
const schema = mongoose.Schema;

const usersSchema = new schema({
    username :{
        type : String,
        required : true
    },
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
    }
});

const Users = mongoose.model('users', usersSchema)

module.exports = Users

