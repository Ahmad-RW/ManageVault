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
        try {
            let type = fileName.substring(fileName.indexOf(".") + 1);
            console.log(type)
            type = type.toLowerCase(type)
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
        console.log(path)
        var folderRef = firebase.storage().ref().child(this.props.projectInContext._id)
        folderRef.child(doc.storageReference).delete().then(() => {
         
            this.dispatchDeleteDocAction(doc)
        }).catch((err) => {
            
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
            return
        }
        else {
            const task = this.getTask(this.state.showDocumentsOf)

            const inputList = task.inputDocuments.map(inDoc => {
                if(inDoc.isImported||inDoc.uploadedFromDisk){
                    return (
                        this.getDocumentTemplate(inDoc)
                    )
                }
                if( isTaskOfOutputSubmitted(inDoc, this.props.projectInContext) ){
                    return (this.getDocumentTemplate(inDoc))
                }
                if(inDoc.deleted||inDoc.file===""){
                    return
                
                }
                
            })
            const outList = task.outputDocuments.map(outDoc => {
                if(outDoc.hidden ){return}
                return (
                    this.getDocumentTemplate(outDoc)
                )
            })
            return inputList.concat(outList)
        }
    }
    renderProjectDocuments = () => {
        return (
            this.props.projectInContext.documents.map(doc => {
                return (
                    this.getDocumentTemplate(doc)
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
    getDocumentTemplate = doc => {
        return (
            <div class="card border-secondary mb-3 col-sm-3" key={doc._id} >
                <div class="card-header bg-transparent border-primary"><span className="storage-card">{doc.name}</span></div>
                <div class="card-body ">
                    <h5 class="card-title">
                        {this.renderLogo(doc.fileName)}
                    </h5>
                    <p class="card-text">
                        <a className="text-dark" href={doc.file} target="_blank"><i class="material-icons">cloud_download</i></a>
                        <a onClick={() => { this.deleteDocument(doc) }} className="text-dark"><i class="material-icons">delete_forever</i></a>
                    </p>
                </div>
                <div class="card-footer bg-transparent border-primary">Footer</div>
            </div>
        )
    }
    renderFilterByTaskDropdown = () => {

        return (
            <div className="form-group">

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
        console.log(this.state.showDocumentsOf)
    }
    render() {
        return (
            <div>
                <div className="row">
                    {this.renderFilterByTaskDropdown()}
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
