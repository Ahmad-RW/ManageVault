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
// var options = {
//     directory: __dirname+'/Temp',
//     filename: "cat.pdf"
// }
// download("https://firebasestorage.googleapis.com/v0/b/managevault.appspot.com/o/5c862f0ce313880c1ff8a7ee%2Fe1254a16-56a7-402d-87b8-24d567d7b710?alt=media&token=bb9744d6-56af-424c-9bd7-3d1061b4aa6d",
// options, function(err){
//     console.log(err,"hhhhh")
// })


app.get('/test', function (req, res) {
    console.log(req.query)

    mongoose.model("users").findById(req.query._id).then(function (record) {
        console.log(record)
        const token = record.token
        const drive = google.drive({ version: 'v3', token })
        drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)'
        }, function (err, result) {
            if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file) => {
                    console.log(`${file.name} (${file.id})`);
                });
            } else {
                console.log('No files found.');
            }

        })
    }).catch(function (err) {
        console.log(err)
    })

})

