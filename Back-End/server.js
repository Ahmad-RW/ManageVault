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

app.post('/deleteproject', function (req,res) {
    console.log(req.body)
    mongoose.model('projects').findByIdAndDelete(req.body.project._id).then(function (err,record) {
        console.log(record)
        res.status(200).send(record)
    }).catch(function (err) {
        console.log(err)
        res.status(500)
    })
})
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
    
    projects.create(project).then(function (project) {
        res.status(200).send(project)
        handleInvite(invitedMembers, project)
        console.log('done')
    }).catch(function (error) {
        console.log(error)
        res.status(500)
    });
});

app.post('/leaveProject', function(req, res){
   // console.log(req.body)
    mongoose.model('projects').findByIdAndUpdate(req.body.project._id, {$pull : { "members" : {email : req.body.userInfo.email} }}).then(function(record){
       if(record.members.length === 1){//delete the project if the last member leaves it. RIP 
           mongoose.model('projects').findByIdAndDelete(req.body.project._id).then(function(record){
               console.log(record)
           }).catch(function(exception){
               console.log(exception)
           })
       }
        res.status(200).send(record)
    }).catch(function(exception){
        console.log(exception)
    })
})
app.post('/handleInvite', function (req, res) {
    console.log(req.body.project)
    const member = {
        email : req.body.userInfo.email,
        teamLeader : false,
        kind : "ACTIVE",
        authorities : []
    }
    mongoose.model("projects").findByIdAndUpdate(req.body.project, {$push :{"members" : member}}).then(function(record){//handles accepting invite. First it pushess themmeber in the project then removes the notification from his mailbox
        mongoose.model("users").findByIdAndUpdate(req.body.userInfo._id, {$pull : {"notifications" : {_id : req.body.notification._id}}}).then(function(record){
            // console.log(record)
            res.status(200).send(record)
         })
    }).catch(function(err){
        console.log(err)
    })
    
})
app.post('/handleNotificationDelete', function(req, res){
    console.log(req.body)
    mongoose.model('users').findByIdAndUpdate(req.body.userInfo._id, {$pull : {"notifications" :{_id : req.body.notification._id}}}).then(function(record){
        console.log(record)
        res.status(200).send(record)
    }).catch(function(err){
        console.log(err)
    })
})

app.listen('3333', function () {
    console.log('listening on 3333')
});

//helper functions
function handleInvite(invitedMembers, project) {//basically this function sends a notification to the users who are invited to a project. It's been refactored due to size.
    console.log(project._id, "this is project id")
    const obj = {kind : "PROJECT_INVITE", date : new Date, data : { title : project.title , creator : project.creator, projectId :  project._id}}
    console.log(obj, "single notificagion")
    invitedMembers.forEach(member => {
        console.log(member)
        mongoose.model('users').findOneAndUpdate({email : member}, {$push :{"notifications" : obj}}).then(function(record){
            console.log(record, "record")
        }).catch(function(error){
            console.log(error)
        })
    })
}
