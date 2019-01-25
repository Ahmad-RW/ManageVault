var express = require('express')
var app = express()
var bodyParser = require('body-parser');
const mongoose = require('mongoose')
const users = require('./models/users');
const projects = require('./models/projects')


//db connection
mongoose.connect('mongodb://ahmad:123456789ahmad@ds145184.mlab.com:45184/manage_vault', { useNewUrlParser: true });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
var urlencoded = app.use(bodyParser.urlencoded({ extended: false }));



//routes
app.get('/', function (req, res) {
    res.send('hi')
});

app.get('/getUserData', function (req, res) {
    mongoose.model('users').findOne({ email: req.query.userEmail },
        function (err, userInfo) {
            if (err) {
                res.status(500)
            }
            res.status(200).send(userInfo)

        })
});

app.get('/getUserProjects', function (req, res) {
    mongoose.model('projects').find({ "members.email": req.query.userEmail },
        function (err, userProjects) {
            if (err) {
                res.status(500)
            }
            res.status(200).send(userProjects)
        })
});

app.post('/newuser', function (req, res) {
    users.create(req.body).then(function (user) {
        res.status(200).send(user)
    }).catch(function () {
        res.status(500)
    })
});

app.post('/newproject', function (req, res) {
    let project = {
        title: req.body.project.title,
        creator: req.body.project.creator,
        major_course: req.body.project.major_course,
        status: 'RUNNING',
        members: req.body.project.members
    }
    let invitedMembers = req.body.project.invitedMembers.replace(/\s/g,'')//remove all spaces so when we matcn names we don't include spaces (e.g. test@test.com,test2@test.com)
    invitedMembers = invitedMembers.split(',')//basically split the string at the commas and return each section as an element in an array.
    handleInvite(invitedMembers, project)
    projects.create(project).then(function (project) {
        res.status(200).send(project)
        console.log('done')
    }).catch(function (error) {
        console.log(error)
        res.status(500)
    });
});

app.listen('3333', function () {
    console.log('listening on 3333')
});

//functions
function handleInvite(invitedMembers, project) {//basically this function sends a notification to the users who are invited to a project. It's been refactored due to size.
    console.log(invitedMembers)
    const obj = {kind : "PROJECT_INVITE", date : new Date, data : { title : project.title , creator : project.creator}}
    invitedMembers.forEach(member => {
        console.log(member)
        mongoose.model('users').findOneAndUpdate({email : member}, {$push :{"notifications" : obj}}).then(function(record){
            console.log(record, "record")
        }).catch(function(error){
            console.log(error)
        })
    });
}