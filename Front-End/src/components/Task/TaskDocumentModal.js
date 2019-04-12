import React, { Component } from 'react'
import { connect } from 'react-redux'
import { makeid, isMemberAssigned, isUserTeamLeader, checkAuthority } from '../../helper'
import { handleOutput, removeOutputDocument, handleInputDocument, removeInputDocument, checkActivity } from '../../store/actionCreators/taskActions'
import UploadFile from './UploadInput';
import UploadOutput from './UploadOutput'
import DBXChooser from '../storage/DBXChooser';
import { handleDBXImport } from '../../store/actionCreators/storageActions';

class TaskDocumentModal extends Component {
    state = {
        outputDocuments: null,
        errorMSG: <div></div>,
    }
    componentDidMount() {
        var options = {
            success: (files) => {
                this.onSuccess(files)
            },
            multiselect: true,

        }
        var button = window.Dropbox.createChooseButton(options)
        var eID = this.props.task._id + " DBXChooser"
        document.getElementById(eID).append(button)
    }
    onSuccess = (files) => {
        const payload = {
            files,
            userInfo: this.props.userInfo,
            project: this.props.projectInContext,
            isInput: true,
            task: this.props.task
        }
        this.props.handleDBXImport(payload)

    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }
    renderInputDocuments = () => {
        let x = []
        this.props.projectInContext.tasks.map(task => {

            if (this.props.task === task) { return }
            if (task.outputDocuments.length === 0) { return }
            else {
                x = task.outputDocuments.map(outputDocument => {
                    if (this.searchForInputDocument(outputDocument)) { return }
                    return (
                        <div>
                            <a class="dropdown-item" onClick={() => { this.handleInputDocument(outputDocument, outputDocument.name) }}>{outputDocument.name} : <b>{task.name}</b></a>
                        </div>
                    )
                })

            }
        })
        return x
    }
    searchForInputDocument = (Document) => {
        const inputDocuments = this.props.task.inputDocuments
        if (inputDocuments.find(ODocument => { return ODocument.name === Document.name }) === undefined) { return false }
        else { return true }
    }
    handleInputDocument = (outputDocument, logicalName) => {
        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            inputDocument: {
                name: outputDocument.name,
                fileName: outputDocument.fileName,
                file: outputDocument.file,
                storageReference: outputDocument.storageReference,
                outputOf: logicalName,

            }
        }
        this.props.handleInputDocument(payload)
    }
    renderInputDocumentsList = () => {
        const list = this.props.task.inputDocuments.map(Document => {
            return (
                <p>{Document.name}{this.renderRemoveInputDocument(Document)}</p>
            )
        })
        return list
    }
    renderRemoveInputDocument = (Document) => {
        if (isUserTeamLeader(this.props.userInfo, this.props.projectInContext) || checkAuthority(this.props.projectInContext, "MODIFY_TASK", this.props.userInfo)) {
            return (
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemoveInputDocument(Document) }}>
                    <i className="material-icons ">highlight_off</i>
                </button>
            )
        }
    }
    handleRemoveInputDocument = (Document) => {
        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            Document: Document
        }
        this.props.removeInputDocument(payload)
    }
    renderInputDocumentsButton = () => {
        return (
            <div class="dropdown">
                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                    Output of Other Tasks
                    </button>
                <div class="dropdown-menu">
                    {this.renderInputDocuments()}
                </div>
            </div>
        )
    }
    searchForOutputDocument = (Document) => {
        const outputDocuments = this.props.task.outputDocuments
        if (outputDocuments.find(ODocument => { return ODocument.name === Document }) === undefined) { return false }
        else { return true }
    }
    handleSubmitOutput = (e) => {
        if (this.state.outputDocuments === null || this.state.outputDocuments.trim() === "") {
            this.renderErrorMessage("null")
            return
        }

        if (this.searchForOutputDocument(this.state.outputDocuments)) {
            this.renderErrorMessage("redundant")
            return
        }

        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            outputDocument: {
                hidden: true,
                name: this.state.outputDocuments,
                fileName: "",
                file: "",
                storageReference: ""
            }
        }

        this.props.handleOutput(payload)
    }
    renderErrorMessage = (type) => {
        let error
        if (type === "null") {
            error = <div className="alert alert-danger" role="alert">
                Please type something!
                <button type="button" className="close" aria-label="Close" onClick={this.closeAlert}>
                    <i className="material-icons ">highlight_off</i>
                </button>
            </div>
        }
        if (type === "redundant") {
            error = <div className="alert alert-danger" role="alert">
                this outputDocument is already exists!
                <button type="button" className="close" aria-label="Close" onClick={this.closeAlert}>
                    <i className="material-icons ">highlight_off</i>
                </button>
            </div>
        }
        this.setState({
            errorMSG: error
        })
    }
    closeAlert = () => {
        this.setState({
            errorMSG: <div></div>
        })
    }
    renderUploadOutput = (isInput, Document) => {
        if (isMemberAssigned(this.props.task, this.props.userInfo)) {
            return (
                <span><UploadOutput task={this.props.task} isInput={isInput} documentName={Document.name} /></span>
            )
        }
    }
    renderOutput = () => {
        const outputDocuments = this.props.task.outputDocuments.map(Document => {
            return (
                <div>
                    <p>{Document.name}{this.renderRemoveOutputDocument(Document)} {this.renderUploadOutput(false, Document)} </p>
                </div>
            )
        })
        return outputDocuments
    }
    renderRemoveOutputDocument = (Document) => {
        if (isMemberAssigned(this.props.task, this.props.userInfo) || checkAuthority(this.props.projectInContext, "MODIFY_TASK", this.props.userInfo)) {
            return (
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemoveOutputDocument(Document) }}>
                    <i className="material-icons ">highlight_off</i>
                </button>
            )
        }
    }
    handleRemoveOutputDocument = (Document) => {
        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            Document: Document
        }

        this.props.removeOutputDocument(payload)
    }
    renderSelectInputFromProjectDocuments = () => {
        return (
            <div class="dropdown">
                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                    Project Documents
                    </button>
                <div class="dropdown-menu">
                    {this.renderProjectDocuments()}
                </div>
            </div>
        )
    }
    renderProjectDocuments = () => {
        if (this.props.projectInContext.documents.length === 0) {
            return
        }
        return (
            this.props.projectInContext.documents.map(doc => {
                return (
                    <a class="dropdown-item" onClick={() => { this.handleInputDocument(doc, doc.name) }}>{doc.name}</a>
                )
            })
        )
    }
    render() {
        const text = makeid()
        return (
            <div>
                <div className="tooltips">
                    <button title="Task Documents" type="button" class="close tooltips" data-toggle="modal" data-target={"#" + text} >
                        <i class="material-icons">folder</i>
                    </button>
                    <span className="tooltiptext">Task's Documents</span>
                </div>
                <div class="modal fade" id={text} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="exampleModalLabel">{this.props.task.name}</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body container">
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Set Input Document</h5>
                                    </div>
                                </div>
                                <div>
                                    <p>input Documents of this  task:</p>
                                    {this.renderInputDocumentsList()}

                                </div>
                                <div className="row">
                                    <div classname="col-6">
                                        {this.renderInputDocumentsButton()}
                                    </div>
                                    <div className="col-6">
                                        {this.renderSelectInputFromProjectDocuments()}
                                    </div>
                                </div>
                                <hr />

                                <div className="row">
                                    <div className="col-6">
                                        <p>Upload from your disk</p>
                                        <UploadFile task={this.props.task} isInput={true} />
                                    </div>
                                    <div className="col-6" id={this.props.task._id + " DBXChooser"}>
                                        <p>or Import input documents from Dropbox</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Set Output Document</h5>
                                    </div>
                                </div>
                                {this.state.errorMSG}
                                <input className="form-control" onChange={this.handleChange} placeholder={this.props.task.outputDocuments} id="outputDocuments" type="text" />
                                <button className="btn btn-primary" onClick={this.handleSubmitOutput}>Submit</button>
                                <div>
                                    <p>output Documents of this task:</p>
                                    {this.renderOutput()}
                                </div>

                                <hr />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext,
        projects: state.projects,
        userInfo: state.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleOutput: (payload) => dispatch(handleOutput(payload)),
        removeOutputDocument: (payload) => dispatch(removeOutputDocument(payload)),
        handleInputDocument: (payload) => dispatch(handleInputDocument(payload)),
        removeInputDocument: (payload) => dispatch(removeInputDocument(payload)),
        handleDBXImport: (payload) => dispatch(handleDBXImport(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskDocumentModal)