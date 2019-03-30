var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser');
const projectRoute = require('./routes/projectRoutes')
const userRoute = require('./routes/userRoutes')
const taskRoute = require('./routes/taskRoutes')
const storageRoute = require('./routes/storageRoutes')
var download = require('download-file')
var google = require('googleapis').google
const credentiales = require('./CS.json')
const users = require('./models/users');
const mongoose = require('./dbConfig/databaseCon')

const auth = new google.auth.OAuth2(
    credentiales.web.client_id,
    credentiales.web.client_secret,
    credentiales.web.redirect_uris[1]
)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    
});
app.use(bodyParser.json());// post request body parser
app.use(express.static('public'));//I think this allows all public URLs in

//routes
app.get('/', function (req, res) {
    res.send("hi")
})



app.post('/getGoogleURL', function (req, res) {
    const defaultScope = ['https://www.googleapis.com/auth/drive.metadata.readonly']
    const url = auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: defaultScope
    })
    res.send(url)
})

app.post('/setAccessToken', function (req, res) {
    console.log(req.body.payload)

    auth.getToken(req.body.payload.code, function (err, response) {//save token to database
        console.log(response)
        mongoose.model("users").findOneAndUpdate({ "email": req.body.payload.userEmail }, { $set: { "token": response } }, { new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (err) {//to err is human
            console.log(err) //to log is not human tho
        })
    })
})
app.use('/project', projectRoute);// any route starting with /project go to project route. which is exported from projectRoutes
app.use('/user', userRoute);// same goes here
app.use('/task', taskRoute);
app.use('/storage', storageRoute)



app.listen('3333', function () {
    console.log('listening on 3333')
})




