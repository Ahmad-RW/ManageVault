var express = require('express')
var app = express()
var bodyParser = require('body-parser');
const mongoose = require('mongoose')
const users = require('./models/users');



//db connection
mongoose.connect('mongodb://ahmad:123456789ahmad@ds145184.mlab.com:45184/manage_vault', { useNewUrlParser: true });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json());
var urlencoded = app.use(bodyParser.urlencoded({extended : false}));



//routes
app.get('/', function(req,res){
    res.send('hi')
});

app.post('/newuser', function(req, res){
console.log(req.body)
users.create(req.body).then(function(user){

    res.status(200).send(user)

}).catch(function(){

    res.status(500)
})

});


app.listen('3333', function(){
    console.log('listening on 3333')
});