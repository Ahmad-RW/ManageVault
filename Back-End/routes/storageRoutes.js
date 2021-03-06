const express = require('express');
const storageRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')

storageRoute.post("/fileUpload", function (req, res) {
    let name = req.body.payload.metaData.fileName
    if (req.body.payload.documentName) {
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
        $push: {
            "documents": document
        },

    }, { new: true }).then(function (record) {
        res.status(200).send(record)
    }).catch(function (exception) {
        res.status(500).send(exception)
    })
})
storageRoute.get('/getPublishedProjects', function (req, res) {//do not delete unused variable req
    console.log("ewgwegwgwgweg")
    mongoose.model("projects").find({ "status": "PUBLISHED" }).then(function (record) {
        res.status(200).send(record)
    }).catch(function (exception) {
        console.log(500)
        res.status(500).send(exception)
    })
})
storageRoute.post('/publishProject', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.project._id,
        {
            $set: {
                "status": "PUBLISHED",
                publishDate : new Date()
            }
        }, { new: true }
    ).then(function (record) {
        res.status(200).send(record)
    }).catch(function (exception) {
        res, status(500).send(exception)
    })
})

storageRoute.post('/unpublishProject', function (req, res) {

    mongoose.model("projects").findByIdAndUpdate(req.body.project._id,
        {
            $set: {
                "status": "RUNNING"
            }
        }, { new: true }
    ).then(function (record) {
        res.status(200).send(record)
    }).catch(function (exception) {
        res, status(500).send(exception)
    })
})


storageRoute.post('/deleteDocument', function (req, res) {

    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {
        $set: {
            "documents.$[doc].deleted": true, "tasks.$[].inputDocuments.$[inputDoc].deleted": true,
            "tasks.$[].outputDocuments.$[outDoc].deleted": true
        }
    }, {
        arrayFilters: [{
            "doc._id": mongoose.Types.ObjectId(req.body.payload.document._id)
        }, { "inputDoc.storageReference": req.body.payload.document.storageReference },
        { "outDoc.storageReference": req.body.payload.document.storageReference }], new: true
        }).then(function (Record) {
            res.status(200).send(Record)
        }).catch(function (err) {
            res.status(500).send(err)
        })
})


module.exports = storageRoute