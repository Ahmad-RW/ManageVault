var express = require('express')
var app = express()
const path= require('path')
var bodyParser = require('body-parser');
const projectRoute = require('./routes/projectRoutes')
const userRoute = require('./routes/userRoutes')
const taskRoute = require('./routes/taskRoutes')
const storageRoute = require('./routes/storageRoutes')
const dbxRoute = require('./routes/dropboxRoutes')
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    
});
app.use(bodyParser.json());// post request body parser
app.use(express.static('public'));//I think this allows all public URLs in



app.use('/project', projectRoute);// any route starting with /project go to project route. which is exported from projectRoutes
app.use('/user', userRoute);// same goes here
app.use('/task', taskRoute);
app.use('/storage', storageRoute)
app.use('/dropbox', dbxRoute)


//Static file declaration
app.use(express.static(path.join(__dirname, 'Front-End/build')));

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'Front-End/build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'Front-End/build/index.html'));
  })
}

//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/Front-End/public/index.html'));
})


app.listen('3333', function () {
    console.log('listening on 3333')
})

