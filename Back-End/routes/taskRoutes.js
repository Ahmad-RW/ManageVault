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
        feedback: "",
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
    const newTaskOutputDocuments = showHiddenOutputDocuments(req.body.payload.task, req.body.payload.project)

    mongoose.model("projects").findByIdAndUpdate(req.body.payload.project._id, {
        $set: {
            "tasks.$[elem].status": "SUBMITTED",
            "tasks.$[elem].endDate": req.body.payload.endDate,
            "tasks.$[elem].outputDocuments": newTaskOutputDocuments,

        }
    },
        { arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(req.body.payload.task._id) }], new: true }).then(function (record) {

            res.status(200).send(record)
         
        }).catch(function (exception) {
            console.log(exception)
            res.status(500).send(exception)
        })
})

function showHiddenOutputDocuments(task) {
    const newTaskDocuments = task.outputDocuments.map(doc => {
        doc.hidden = false
        return doc
    })
    return newTaskDocuments
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
        contentType: document.contenType,
        uploadedFromDisk : true,
        fileName: payload.metaData.fileName,
        file: payload.url,
        storageReference: payload.storageReference
    }
    mongoose.model("projects").findByIdAndUpdate(payload.projectInContext._id,
        {
            $push: {
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
    document = { ...document, hidden: true }
    const outputDocument = {
        name: payload.documentName,
        hidden: true,
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
        storageReference: req.body.payload.storageReference,
        relatedTasks: [req.body.payload.task._id]
    }
    if (req.body.payload.isInput) {
        handleInputUpload(req.body.payload, document, res)

    }
    else {

        handleOutputUpload(req.body.payload, document, res)
    }

})

taskRoute.post('/inputDocument', function (req, res) {

    const document = {
        name: req.body.payload.documentName,//logical name
        size: req.body.payload.metaData.size,
        extension: req.body.payload.metaData.type,
        contentType: req.body.payload.metaData.contentType,
        lastModified: req.body.payload.metaData.updated,
        file: req.body.payload.url,
        fileName: req.body.payload.metaData.fileName,//physical name
        storageReference: req.body.payload.storageReference,
        relatedTasks: [req.body.payload.task._id]
    }



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
//helper function
function normalize(text) {
    text = text.replace(/\s/g, '');
    text = text.split(',')
    return text
}
module.exports = taskRoute