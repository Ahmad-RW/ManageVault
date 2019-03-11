const express = require('express');
const storageRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')

storageRoute.post("/fileUpload", function(req,res){
    console.log(req.body)
  
  
  //  res.status(200).send(req.body)
  let name = req.body.payload.metaData.fileName
  if(req.body.payload.documentName){
      name = req.body.payload.documentName
  }
    const document = {
        name: name,//logical name
        size: req.body.payload.metaData.size,
        //extension: req.body.payload.metaData.type,
        contentType: req.body.payload.metaData.contentType,
        lastModified: req.body.payload.metaData.updated,
        file: req.body.payload.url,
        fileName: req.body.payload.metaData.fileName,//physical name
        storageReference: req.body.payload.storageReference
    }
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.projectInContext._id, {
        $push:{
            "documents" : document
        },
        
    }, {new : true}).then(function(record){
        res.status(200).send(record)
    }).catch(function(exception){
        res.status(500).send(exception)
    })
})

module.exports = storageRoute