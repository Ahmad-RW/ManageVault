var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser');
const projectRoute = require('./routes/projectRoutes')
const userRoute = require('./routes/userRoutes')
const taskRoute = require('./routes/taskRoutes')
const storageRoute = require('./routes/storageRoutes')
const dbxRoute = require('./routes/dropboxRoutes')
var download = require('download-file')
var google = require('googleapis').google
const credentiales = require('./CS.json')
const users = require('./models/users');
const mongoose = require('./dbConfig/databaseCon')
const Dropbox = require('dropbox').Dropbox
const dropboxV2Api = require('dropbox-v2-api')
const zipFolder = require('zip-folder');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require("async");
require('isomorphic-fetch');
const path = require('path')
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

    const defaultScope = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file']
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
        }).catch(function (err) {
            console.log(err)
        })
    })
})
app.use('/project', projectRoute);// any route starting with /project go to project route. which is exported from projectRoutes
app.use('/user', userRoute);// same goes here
app.use('/task', taskRoute);
app.use('/storage', storageRoute)
app.use('/dropbox', dbxRoute)



app.listen('3333', function () {
    console.log('listening on 3333')
})


app.get('/testGoogle', function (req, res) {
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


app.get('/testdb', function (req, res) {
    var dbx = new Dropbox({ accessToken: 'cWsweSwg_UAAAAAAAAAAOk5wz0yytOpbNls9BWveYvOhsMLVZ0O8G_n-jeuk1VvD' });
    dbx.filesListFolder({ path: '' })
        .then(function (response) {
            console.log(response);
            res.send(response)
        })
        .catch(function (error) {
            console.log(error);
        });

})

app.get('/testGetUrl', function (req, res) {
    const dbx = new Dropbox({ clientId: 'i5wrl2nwojuijhn' });
    const authURL = dbx.getAuthenticationUrl('http://localhost:3000/home')
    res.send(authURL)

})

app.post('/setAccessTokenDBX', function (req, res) {
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


app.get('/testAPI', function (req, res) {
    const access_token = 'cWsweSwg_UAAAAAAAAAASGDbLkwkm46uABp_5bFpj3Ms7L34rmTwqgbK4iRXHLL0'
    const dbx = new Dropbox({ accessToken: access_token })
    fs.readFile(path.join(__dirname, '/test.js'), function (err, data) {
        if (err) {
            throw err;
        }
        console.log(data)
        dbx.filesUpload({ path: '/test.js', contents: data }).then(function (result) {

            res.status(300).send(result)
        }).catch(function (err) {
            res.status(500).send(err)
        })
    })
});

app.get('/testAPIV2', function (req, res) {
    const dropbox = dropboxV2Api.authenticate({
        token: 'cWsweSwg_UAAAAAAAAAASGDbLkwkm46uABp_5bFpj3Ms7L34rmTwqgbK4iRXHLL0'
    })
    dropbox({
        resource: 'files/upload',
        parameters: {
            path: '/test'
        },
        readStream: fs.createReadStream('C:/Users/gears/Desktop/Manage Vault/Back-End/text.txt')
    }, (err, result, response) => {
        if (err) {
            res.status(500).send(err)
        }
        console.log(result)
        res.status(200).send(response)

    });
})

app.get('/testALL', function (req, res) {
    const urls = [{
        url: "https://firebasestorage.googleapis.com/v0/b/managevault.appspot.com/o/5c95277b77d5c4392c2fc163%2Fae04d8a4-3eac-47e0-8ca6-9737c50d2b0c?alt=media&token=ddced1ff-d6e4-4683-a0e4-58848376cc60",
        filename: "Capture2.PNG"
    }, {
        url: "https://firebasestorage.googleapis.com/v0/b/managevault.appspot.com/o/5c95277b77d5c4392c2fc163%2F4269b224-55bb-42c0-927e-de5a4da14b95?alt=media&token=0d2cdf43-5608-4f0f-83b9-2136d99db36e",
        filename: "Capture3.PNG"
    },
    {
        url: "https://firebasestorage.googleapis.com/v0/b/managevault.appspot.com/o/5c95277b77d5c4392c2fc163%2Fd7a1b353-16c3-4604-847d-874b56fd1dd5?alt=media&token=9d888d4a-b4a0-40f1-ba52-77c2fb049f1d",
        filename: "Capture4.PNG"
    }]

    const dir = path.join(__dirname, "/testing exprt" + "exported files")
    mkdirp(path.join(__dirname, "/testing exprt" + "exported files"), function (err) {
        if (err) {
            res.status(500).send(err)
        }
        
        async.each(urls, function (elem, callback) {
            var options = {
                directory: dir,
                filename: elem.filename
            }
            download(elem.url, options, function (err) {
                console.log("downloading")
                if (err) {
                    callback(err)
                }
                callback()
            })
        }, function (err) {
            const compressedDir = path.join(__dirname, '/testing exprt exported files.zip')
            zipFolder(dir ,compressedDir, function (err) {
                console.log("zipping")
                if (err) {
                    res.status(500).send(err)
                }

                const access_token = 'cWsweSwg_UAAAAAAAAAASGDbLkwkm46uABp_5bFpj3Ms7L34rmTwqgbK4iRXHLL0'
                const dbx = new Dropbox({ accessToken: access_token })
                fs.readFile(compressedDir, function (err, data) {
                    if (err) {
                        throw err;
                    }
                    console.log(data)
                    dbx.filesUpload({ path: '/yyyyyyyyyyyyy.zip', contents: data }).then(function (result) {
                        res.status(300).send(result)
                    }).catch(function (err) {
                        res.status(500).send(err)
                    })
                //res.status(200).send()
               
                rimraf(compressedDir, function (err) {
                    if (err) {
                        res.status(500).send(err)
                    }
                    res.status(200).send()
                })
                

            })
        })
    })


    })
})


app.get('/testDownload', function (req, res) {

    var options = {
        directory: __dirname + '/Temp',
        filename: "capture.png"
    }
    download("https://firebasestorage.googleapis.com/v0/b/managevault.appspot.com/o/5c95277b77d5c4392c2fc163%2Fd7a1b353-16c3-4604-847d-874b56fd1dd5?alt=media&token=9d888d4a-b4a0-40f1-ba52-77c2fb049f1d",
        options, function (err) {
            if (err) {
                throw err
            }
        })

})

app.get('/testMkDir', function (req, res) {
    mkdirp(path.join(__dirname, '/testingMKD'), function (err) {
        if (err) console.error(err)
        else console.log('pow!')
    });
})


app.get('/testRimRaf', function (req, res) {
    rimraf(path.join(__dirname, '/testingMKD'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send()
    })
})

app.get('/testCompress', function (req, res) {
    zipFolder(path.join(__dirname, '/testingMKD'), path.join(__dirname, '/compressed-testingMKD.zip'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send()
    })
});
