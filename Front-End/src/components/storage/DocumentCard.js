import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from "firebase";
import { deleteDocument } from '../../store/actionCreators/storageActions'
import { isOutputTaskSubmitted, isTaskOfOutputSubmitted } from '../../helper';
var assets = require.context("../../assets", true)
class DocumentCard extends Component {
    state = {
        projectDocuments: this.props.projectInContext.documents,//dont delete. ignore
        showDocumentsOf: ""
    }

    renderLogo = (fileName) => {
        let imgSrc;
        console.log(fileName)
        try {
            let type = fileName.substring(fileName.indexOf(".") + 1);
            console.log(type)
            type = type.toLowerCase()
            imgSrc = assets("./" + type + ".svg")
        } catch (error) {
            imgSrc = assets("./file.svg")
        }
        return (
            <img src={imgSrc} />
        )

    }
    deleteDocument = (doc) => {
        if (doc.isImported) {
            this.dispatchDeleteDocAction(doc)
            return
        }
        var path = "" + this.props.projectInContext._id + "/" + doc.storageReference
        var folderRef = firebase.storage().ref().child(this.props.projectInContext._id)
        folderRef.child(doc.storageReference).delete().then(() => {
            
            this.dispatchDeleteDocAction(doc)
        }).catch((err) => {
            console.log(err.message)
        })
    }
    dispatchDeleteDocAction = (doc) => {
        const payload = {
            project: this.props.projectInContext,
            document: doc
        }
        this.props.deleteDocument(payload)
    }

    renderDocumentsCard = () => {
        if (this.state.showDocumentsOf === "Project_Documents") {
            return (
                this.renderProjectDocuments()
            )
        }
        if (this.state.showDocumentsOf === "") {
            return (
                this.renderAllDocuments()
            )
        }
        else {
            const task = this.getTask(this.state.showDocumentsOf)

            const inputList = task.inputDocuments.map(inDoc => {
                if (inDoc.deleted || inDoc.file === "") {
                    return

                }
                if (inDoc.isImported || inDoc.uploadedFromDisk) {
                    return (
                        this.getDocumentTemplate(inDoc,task.name, "input document")
                    )
                }
                if (isTaskOfOutputSubmitted(inDoc, this.props.projectInContext)) {
                    return (this.getDocumentTemplate(inDoc, task.name, "input document"))
                }
               

            })
            const outList = task.outputDocuments.map(outDoc => {
                if (outDoc.hidden || outDoc.deleted) { return }
                return (
                    this.getDocumentTemplate(outDoc, task.name, "input document")
                )
            })
            return inputList.concat(outList)
        }
    }
    renderAllDocuments = () => {
        let projectDocs = this.renderProjectDocuments()
        let tasks = this.props.projectInContext.tasks
        var allInputDocs = tasks.map(element => {
            if (element.deleted || element.file === "") {
                return

            }
            return (element.inputDocuments.map(inputDoc => {
                return (
                    this.getDocumentTemplate(inputDoc, element.name,"input document")
                )
            })
            )
        })
        var allOutputDocs = tasks.map(element => {
            if (element.hidden || element.deleted) { return }
            return (element.outputDocuments.map(outDoc => {
                return (
                    this.getDocumentTemplate(outDoc, element.name, "output document")
                )
            }))
        })
        return projectDocs.concat(allInputDocs, allOutputDocs)
    }
    renderProjectDocuments = () => {
        return (
            this.props.projectInContext.documents.map(doc => {
                return (
                    this.getDocumentTemplate(doc, "", "project document")
                )
            })
        )
    }

    getTask = taskId => {
        let selectedTask;
        this.props.projectInContext.tasks.forEach(task => {
            if (task._id === taskId) {
                selectedTask = { ...task }

            }
        })
        return selectedTask
    }
    getDocumentTemplate = (doc, taskName = "", docRole) => {
        if(doc.deleted){
            return
        }
      var footer = <div class="card-footer bg-transparent border-primary">this document is related to the task <b>({taskName})</b> </div>
      if(taskName===""){
          footer = <div class="card-footer bg-transparent border-primary"> this is a <b>project</b> documents </div>
      }
        return (
            <div class="card border-secondary mb-3 col-sm-3" key={doc._id} >
                <div class="card-header bg-transparent border-primary"><span className="storage-card">{doc.name}   </span></div>
                <div class="card-body ">
                {docRole}
                    <h5 class="card-title">
                    
                        {this.renderLogo(doc.fileName)}
                    </h5>
                    <p class="card-text">
                        <a className="text-dark" href={doc.file} target="_blank"><i class="material-icons">cloud_download</i></a>
                        <a onClick={() => { this.deleteDocument(doc) }} className=" close"><i class="material-icons">delete_forever</i></a>
                    </p>
                </div>
                {footer}
            </div>
        )
    }
    renderFilterByTaskDropdown = () => {

        return (
            <div className="form-group">
                <label>Filter by Task</label>
                <select className="form-control" onChange={this.reRenderView} id="showDocumentsOf">
                    <option value="" id="showDocumentsOf">Dont apply filters</option>
                    <option value="Project_Documents" id="showDocumentsOf">Project Documents</option>
                    {this.renderFilterByTaskItems()}
                </select>

            </div>
        )
    }
    renderFilterByTaskItems = () => {
        return (
            this.props.projectInContext.tasks.map(task => {
                return (
                    <option value={task._id} id="showDocumentsOf">{task.name}</option>
                )
            })
        )
    }
    reRenderView = e => {
        this.setState({
            [e.target.id]: e.target.value
        })

    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-8">
                        {this.renderFilterByTaskDropdown()}
                    </div>
                </div>
                <div className="row">
                    {this.renderDocumentsCard()}
                </div>
            </div>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteDocument: (payload) => dispatch(deleteDocument(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentCard)
