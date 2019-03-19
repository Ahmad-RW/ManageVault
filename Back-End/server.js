var express = require('express')
var app = express()
var fs = require('fs')
var http = require('http')
var bodyParser = require('body-parser');
const projectRoute = require('./routes/projectRoutes')
const userRoute = require('./routes/userRoutes')
const taskRoute = require('./routes/taskRoutes')
const storageRoute = require('./routes/storageRoutes')
var download = require('download-file')

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
app.use('/storage', storageRoute)
app.post('/test', function (req, res) {
    var options = {
        directory: __dirname+'/Temp',
        filename: "cat.pdf"
    }
    
    download("https://firebasestorage.googleapis.com/v0/b/managevault.appspot.com/o/5c862f0ce313880c1ff8a7ee%2Fe1254a16-56a7-402d-87b8-24d567d7b710?alt=media&token=bb9744d6-56af-424c-9bd7-3d1061b4aa6d",
    options, function(err){
        console.log(err,"hhhhh")
    })
    res.status(300).sendFile(options.directory)
    
    
})


app.listen('3333', function () {
    console.log('listening on 3333')
});