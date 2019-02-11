var express = require('express')
var app = express()
var bodyParser = require('body-parser');
const projectRoute = require('./routes/projectRoutes')
const userRoute = require('./routes/userRoutes')
const taskRoute = require('./routes/taskRoutes')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());// post request body parser
app.use(express.static('public'));//I think this allows all public URLs in

//routes
app.get('/', function (req, res) {
    res.send('hi')
});

app.use('/project', projectRoute );// any route starting with /project go to project route. which is exported from projectRoutes
app.use('/user', userRoute );// same goes here
app.use('/task', taskRoute );




app.listen('3333', function () {
    console.log('listening on 3333')
});