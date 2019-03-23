const express = require('express')
const dbxRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')
const Dropbox = require('dropbox').Dropbox
const path = require('path')
const dropboxV2Api = require('dropbox-v2-api')
const zipFolder = require('zip-folder');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require("async");
var download = require('download-file')
file_system = require('fs')
require('isomorphic-fetch');
const credentials = require('../DBX_CRED.json')
dbxRoute.get('/getURL', function (req, res) {
    const dbx = new Dropbox({ clientId: credentials.client_id });
    const authURL = dbx.getAuthenticationUrl('http://localhost:3000/home')
    res.send(authURL)

})
dbxRoute.post('/setAccessToken', function (req, res) {
    const token = {
        access_token: req.body.payload.access_token,
        token_type: req.body.payload.token_type,
        account_id: req.body.payload.account_id,
    }
    mongoose.model("users").findOneAndUpdate({ "email": req.body.payload.userEmail }, { $set: { "token": token } }, { new: true })
        .then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (err) {
            res.status(500).send(err)
        })
})
dbxRoute.post('/export', function (req, res) {
    const payload = req.body.payload
    const tempDir = path.join(__dirname, "" + payload.project.title + " exported files")
    mkdirp(tempDir, function (err) {
        if (err) {
            res.status(50).send(err)
        }
        async.each(payload.documents, function (doc, callback) {
            var options = {
                directory: tempDir,
                filename: doc.name
            }
            download(doc.file, options, function (err) {
                console.log("downloading")
                if (err) {
                    callback(err)
                }
                callback()
            })
        }, function (err) {
            const compressedDir = path.join(__dirname, "/ " + payload.project.title + ' exported files.zip')
            zipFolder(tempDir, compressedDir, function (err) {
                console.log("zipping")
                if (err) {
                    res.status(500).send(err)
                }

                const access_token = payload.userInfo.token.access_token
                const dbx = new Dropbox({ accessToken: access_token })
                file_system.readFile(compressedDir, function (err, data) {
                    if (err) {
                        res.status(500).send(err)
                    }
                    console.log(data)
                    dbx.filesUpload({ path: "/" + payload.project.title + ' exported files.zip', contents: data, autorename:true }).then(function (result) {
                        rimraf(tempDir, function (err) {
                            if (err) {
                                res.status(500).send(err)
                            }

                        })
                        rimraf(compressedDir, function (err) {
                            if (err) {
                                res.status(500).send(err)
                            }
                            res.status(200).send()
                        })
                    }).catch(function (err) {
                        res.status(500).send(err)
                    })

                })
            })
        })
    })
})



module.exports = dbxRoute