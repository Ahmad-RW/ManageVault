const express = require('express');
const taskRoute = express.Router()
const projects = require('../models/projects')
const mongoose = require('../dbConfig/databaseCon')

taskRoute.post('/newTask', function (req, res) {
    let task = {
        name: req.body.payload.task.name,
        description: req.body.payload.task.Description,
        status: req.body.payload.task.status,
        startDate: req.body.payload.task.startDate,
        duration: req.body.payload.task.duration,
        feedback : "",
        t : "",
        hhhhhhhhhhhhh : ""
    }
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project, { $push: { "tasks": task } }, { new: true }).then(function (record) {
        
        res.status(200).send(record)
    }).catch(function (err) {
        res.status(500).send(err)
    })
});


taskRoute.post('/deleteTask', function (req, res) {
    
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.PID, { $pull: { "tasks": { "_id": req.body.payload.task_id } } }, { new: true }).then(function (record) {
       
        res.status(200).send(record)
    }).catch(function (err) {
        res.status(500).send(err)
    })
});

taskRoute.post('/newComment', function (req, res) {
    console.log(req.body)
    newComments = [...req.body.payload.task.comments, req.body.payload.comment]
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,
        { $set: { "tasks.$[elem].comments": newComments } },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            let data ={
                comment:req.body.payload.comment,
                project:req.body.payload.project,
                task:req.body.payload.task
            }
            sendNotification("NEW_COMMENT",data)
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})

taskRoute.post('/setDependancy', function (req, res) {
    console.log(req.body.payload)
    const predecessorTask = {
        taskName: req.body.payload.predecessorTask.name,
        taskId: req.body.payload.predecessorTask._id
    }
    const predecessorTo = { taskName: req.body.payload.taskInContext.name, taskId: req.body.payload.taskInContext._id }
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id,
        {
            $push: {
                "tasks.$[taskInContext].dependencies.predecessor": predecessorTask,
                "tasks.$[predecessorTask].dependencies.predecessorTo": predecessorTo
            }
        },
        {
            arrayFilters: [{ "taskInContext._id": mongoose.Types.ObjectId(req.body.payload.taskInContext._id) },
            { "predecessorTask._id": mongoose.Types.ObjectId(req.body.payload.predecessorTask._id) }
            ], new: true
        }
    ).then(function (record) {
        console.log(record, "HI")
        res.status(200).send(record)
    }).catch(function (exception) {
        console.log(exception)
        res.status(500).send(exception)
    })
})

taskRoute.post('/removeDependancy', function (req, res) {
    console.log(req.body)
    res.status(200).send("STILL WORKING ON IT ")
})


taskRoute.post('/submitTask', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].status": "PENDING_FOR_CONFIRMATION" } },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})

taskRoute.post('/confirmTaskSubmission', function (req, res) {
    const newTaskDocuments = showHiddenDocuments(req.body.payload.task, req.body.payload.project)
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {
        $set: {
            "tasks.$[elem].status": "SUBMITTED",
            "tasks.$[elem].endDate": req.body.payload.endDate,
            "documents" : newTaskDocuments
        }
    },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})

function showHiddenDocuments(task, project, res){
    const newTaskDocuments = project.documents.map(doc=>{
       if(checkNameEquality(task.outputDocuments, doc)){
           doc.hidden = false
       }
       return doc
    })
    
    return newTaskDocuments
}
function checkNameEquality(outputDocuments, document){
    let result = false
    outputDocuments.forEach(outDoc=>{
        if(outDoc.name === document.name){
            result = true
        }
    })
    return result
}
taskRoute.post('/editTask', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {
        $set: {
            "tasks.$[elem].name": req.body.payload.name,
            "tasks.$[elem].description": req.body.payload.description,
            "tasks.$[elem].startDate": req.body.payload.startDate,
            "tasks.$[elem].duration": req.body.payload.duration,
            "tasks.$[elem].submissionCriteria": req.body.payload.submissionCriteria
        }
    }, { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
        console.log(record, "edit task")
        let data ={
            project:req.body.payload.project,
            task:req.body.payload.task,
            editor:req.body.payload.editor,
            editor_email:req.body.payload.editor_email
        }
        sendNotification("EDITTING_TASK",data)
        res.status(200).send(record)
    }).catch(function (err) {
        res.status(500).send(err)
    })
});

taskRoute.post('/assignTask', function (req, res) {
    assignedMember = {
        name: req.body.payload.member.name,
        email: req.body.payload.member.email,
        assigner: req.body.payload.assigner,
        startDate: req.body.payload.startDate,
    }
    console.log(assignedMember, "here")
    newAssignedMembers = [...req.body.payload.task.assignedMembers, assignedMember]
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].assignedMembers": newAssignedMembers } }
        , { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            let data = {
                project:req.body.payload.project,
                assignedMember:assignedMember,
                task:req.body.payload.task
            }
            sendNotification("ASSIGN_TASK", data)
            console.log(record, "assign task")
            res.status(200).send(record)
        }).catch(function (err) {
            console.log(err)
        })
});

taskRoute.post('/newActivity', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $push: { "tasks.$[elem].activities": req.body.payload.activity } },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})

taskRoute.post('/checkActivity', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].activities.$[activity].status": req.body.payload.status } },
        {
            arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) },
            { "activity._id": mongoose.Types.ObjectId(req.body.payload.activity._id) }], new: true
        }).then(function (record) {
            res.status(200).send(record)
        }).catch(function (exception) {
            console.log(exception)
            res.status(500).send(exception)
        })
})

taskRoute.post('/unAssignTask', function (req, res) {
    const assignedMembers = req.body.payload.task.assignedMembers
    const newAssignedMembers = assignedMembers.filter(member => { return member.email !== req.body.payload.member.email })
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].assignedMembers": newAssignedMembers } }
        , { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record, "Unassign task")
            res.status(200).send(record)
        }).catch(function (err) {
            console.log(err)
        })
})

taskRoute.post('/watchTask', function (req, res) {
    const newWatchedMembers = [...req.body.payload.task.watchedBy, req.body.payload.member.email]
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].watchedBy": newWatchedMembers } }
        , { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record, "watch task")
            res.status(200).send(record)
        }).catch(function (err) {
            console.log(err)
        })
})

taskRoute.post('/unWatchTask', function (req, res) {
    const watchedMembers = req.body.payload.task.watchedBy
    const newWatchedMembers = watchedMembers.filter(email => { return email !== req.body.payload.member.email })
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].watchedBy": newWatchedMembers } }
        , { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record, "unwatch task")
            res.status(200).send(record)
        }).catch(function (err) {
            console.log(err)
        })
})




taskRoute.post('/removeDependency', function (req, res) {
    console.log(req.body)
    const newPredeccessorList = req.body.payload.taskInContext.dependencies.predecessor.filter(element => {
        return element.taskId !== req.body.payload.targetTask.taskId
    })

    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {
        $set: {
            "tasks.$[taskInContext].dependencies.predecessor": newPredeccessorList
        },
        $pull: {
            "tasks.$[predecessorTask].dependencies.predecessorTo": { taskId: req.body.payload.taskInContext._id }
        }
    },
        {
            arrayFilters: [{ "taskInContext._id": mongoose.Types.ObjectId(req.body.payload.taskInContext._id) },
            { "predecessorTask._id": mongoose.Types.ObjectId(req.body.payload.targetTask.taskId) }
            ], new: true
        }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            console.log(exception)
            res.status(500).send(exception)
        })

})

function handleInputUpload(payload, document, res) {
   
    let name = payload.metaData.fileName
    if (payload.documentName) {
        name = payload.documentName
    }
    document = {
        ...document,
        name: name,
    }
    const inputDocument = {
        name: name,
        fileName: payload.metaData.fileName,
        file: payload.url,
        storageReference: payload.storageReference
    }
    mongoose.model("projects").findByIdAndUpdate(payload.projectInContext._id,
        {
            $push: {
                "documents": document,
                "tasks.$[element].inputDocuments": inputDocument
            },
        },
        {
            arrayFilters: [{ "element._id": mongoose.Types.ObjectId(payload.task._id) }],
            new: true
        }).then(function (record) {
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })

}
function handleOutputUpload(payload, document, res) {
    document ={...document, hidden:true}
    const outputDocument = {
        name: payload.documentName,
        fileName: payload.metaData.fileName,
        file: payload.url,
        storageReference: payload.storageReference
    }

    let newOutputDocuments = payload.task.outputDocuments.filter(function (doc) {
        return doc.name !== payload.documentName
    })
    newOutputDocuments = [...newOutputDocuments, outputDocument]
    mongoose.model("projects").findByIdAndUpdate(payload.projectInContext._id,
        {
            $push: {
                "documents": document,

            },
            $set: {
                "tasks.$[element].outputDocuments": newOutputDocuments
            }
        },
        {
            arrayFilters: [{ "element._id": mongoose.Types.ObjectId(payload.task._id) }],
            new: true
        }).then(function (record) {
            checkOutputOf(payload.projectInContext, outputDocument, res)
        }).catch(function (exception) {
            console.log(exception)
            res.status(500).send(exception)
        })
}
function checkOutputOf(project, outputDocument, res) {
    mongoose.model("projects").findByIdAndUpdate(project._id,
        {
            $set: {
                "tasks.$[].inputDocuments.$[doc].file": outputDocument.file,
                "tasks.$[].inputDocuments.$[doc].fileName": outputDocument.fileName,
                "tasks.$[].inputDocuments.$[doc].storageReference": outputDocument.storageReference,
                
            }
        },
        {
            arrayFilters: [{ "doc.outputOf": outputDocument.name }],
            new: true, multi: true
        }
    ).then(function (record) {
        res.status(200).send(record)
    }).catch(function (exception) {
        res.status(500).send(exception)
    })
}
taskRoute.post('/fileUpload', function (req, res) {
    const document = {
        name: req.body.payload.documentName,//logical name
        size: req.body.payload.metaData.size,
        extension: req.body.payload.metaData.type,
        contentType: req.body.payload.metaData.contentType,
        lastModified: req.body.payload.metaData.updated,
        file: req.body.payload.url,
        fileName: req.body.payload.metaData.fileName,//physical name
        storageReference: req.body.payload.storageReference
    }
    if (req.body.payload.isInput) {
        handleInputUpload(req.body.payload, document, res)

    }
    else {
        console.log("ba")
        handleOutputUpload(req.body.payload, document, res)
    }

})

taskRoute.post('/inputDocument', function (req, res) {
    console.log(req.body)
    const document = {
        name: req.body.payload.documentName,//logical name
        size: req.body.payload.metaData.size,
        extension: req.body.payload.metaData.type,
        contentType: req.body.payload.metaData.contentType,
        lastModified: req.body.payload.metaData.updated,
        file: req.body.payload.url,
        fileName: req.body.payload.metaData.fileName,//physical name
        storageReference: req.body.payload.storageReference
    }

    console.log(document)

    const inputDocument = {
        name: req.body.payload.documentName,
        fileName: req.body.payload.metaData.fileName,
        file: req.body.payload.url,
        storageReference: req.body.payload.storageReference
    }
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.projectInContext._id,
        {
            $push: {
                "documents": document,
                "tasks.$[element].inputDocuments": inputDocument
            },
        },
        {
            arrayFilters: [{ "element._id": mongoose.Types.ObjectId(req.body.payload.task._id) }],
            new: true
        }).then(function (record) {
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})

taskRoute.post('/removeDocument', function (req, res) {
    console.log(req.body)
    if (req.body.payload.isInput) {
        mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $pull: { "tasks.$[element].inputDocuments": { _id: req.body.payload.document._id } } },
            { arrayFilters: [{ "element._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
                res.status(200).send(record)
            }).catch(function (exception) {
                res.status(500).send(exception)
            })
    }
    // else{
    //     mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $pull: { "tasks.$[element].outputDocuments": { _id: req.body.payload.document._id } } },
    //         { arrayFilters: [{ "element._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
    //             res.status(200).send(record)
    //         }).catch(function (exception) {
    //             res.status(500).send(exception)
    //         })
    // }
})

taskRoute.post('/handleOutput', function (req, res) {
    const outputDocument = req.body.payload.outputDocument
    const newoutputDocuments = [...req.body.payload.task.outputDocuments, outputDocument]
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].outputDocuments": newoutputDocuments } }
        , { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            // console.log(record,"output Document")
            res.status(200).send(record)
        }).catch(function (err) {
            console.log(err)
        })
})

taskRoute.post('/removeOutputDocument', function (req, res) {
    const removedOutputDocument = req.body.payload.Document
    const outputDocuments = req.body.payload.task.outputDocuments.filter(Document => { return Document._id !== removedOutputDocument._id })
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].outputDocuments": outputDocuments } }
        , { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            // console.log(record,"output Document")
            res.status(200).send(record)
        }).catch(function (err) {
            console.log(err)
        })
})

taskRoute.post('/handleInputDocument', function (req, res) {
    const inputDocument = req.body.payload.inputDocument
    const newInputDocuments = [...req.body.payload.task.inputDocuments, inputDocument]

    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].inputDocuments": newInputDocuments } }
        , { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            // console.log(record,"output Document")
            res.status(200).send(record)
        }).catch(function (err) {
            console.log(err)
        })
})

taskRoute.post('/removeInputDocument', function (req, res) {
    const removedInputDocument = req.body.payload.Document
    console.log(removedInputDocument, "hfhfhfffhfhffh ;)")
    const inputDocuments = req.body.payload.task.inputDocuments.filter(Document => { return Document._id !== removedInputDocument._id })
    console.log(inputDocuments, "you better dance ;)")
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].inputDocuments": inputDocuments } }
        , { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            // console.log(record,"output Document")
            res.status(200).send(record)
        }).catch(function (err) {
            console.log(err)
        })
})

taskRoute.post('/declineTaskSubmission', function (req, res) {
    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, { $set: { "tasks.$[elem].status": "TO_DO", "tasks.$[elem].feedback": req.body.payload.feedback } },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {
            console.log(record)
            res.status(200).send(record)
        }).catch(function (exception) {
            res.status(500).send(exception)
        })
})
//helper functions
function sendNotification(kind, data) {
    let notification={}
    if(kind === "ASSIGN_TASK"){
        notification = {
            kind: "ASSIGN_TASK",
            date: new Date,
            data: {projectID: data.project._id,
                    assignedTM: data.assignedMember,
                    assignedTask_name:data.task.name,
                    project_title:data.project.title,
                }
        }
        console.log(notification)
            console.log(data.assignedMember.email)
            mongoose.model("users").findOneAndUpdate({ email: data.assignedMember.email}, { $push: { "notifications":  notification}} ).then(function (record) {
                console.log(record,"Notificatoin sent to members")
            }).catch(function (error) {
                console.log(error)
        })
    }
    if(kind === "NEW_COMMENT"){
        notification = {
            kind: "NEW_COMMENT",
            date: new Date,
            data: {projectID: data.project._id,
                    author: data.comment.author,
                    watchedTask_name:data.task.name,
                    project_title:data.project.title,
                }    
        }
        console.log(notification)
        data.task.watchedBy.forEach(function(member){
            if(data.comment.author_email === member){
                return
            }
            mongoose.model("users").findOneAndUpdate({ email: member}, { $push: { "notifications":  notification}} ).then(function (record) {
                console.log(record,"Notificatoin sent to members")
            }).catch(function (error) {
                console.log(error)
            })
        })
    }
    if(kind === "EDITTING_TASK"){
        notification = {
            kind: "EDITTING_TASK",
            date: new Date,
            data: {projectID: data.project._id,
                    watchedTask_name:data.task.name,
                    project_title:data.project.title,
                    editor:data.editor
                }    
        }
        console.log(notification)
        data.task.watchedBy.forEach(function(member){
            if(data.editor_email === member){
                return
            }
            mongoose.model("users").findOneAndUpdate({ email: member}, { $push: { "notifications":  notification}} ).then(function (record) {
                console.log(record,"Notificatoin sent to members")
            }).catch(function (error) {
                console.log(error)
            })
        })
    }
}

function normalize(text) {
    text = text.replace(/\s/g, '');
    text = text.split(',')
    return text
}
module.exports = taskRoute