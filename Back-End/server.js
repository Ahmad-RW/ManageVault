var express = require('express')
var app = express()
var bodyParser = require('body-parser');
//const mongoose = require('mongoose')
const users = require('./models/users');
const projects = require('./models/projects')
const projectRoute = require('./routes/projectRoutes')
const mongoose = require('./dbConfig/databaseCon')
const userRoute = require('./routes/userRoutes')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());


app.use(express.static('public'));

  
//routes
app.get('/', function (req, res) {
    res.send('hi')
});

app.use('/project', projectRoute );
app.use('/user', userRoute );

app.listen('3333', function () {
    console.log('listening on 3333')
});