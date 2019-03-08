import React, { Component } from 'react'
import { connect } from 'react-redux'
import { makeid, isMemberAssigned } from '../../helper'
import { handleOutput, removeOutputDocument, handleInputDocument, removeInputDocument } from '../../store/actionCreators/taskActions'
import UploadFile from './UploadFile';
import UploadOutput from './UploadOutput'

class TaskDocumentModal extends Component {
    state = {
        outputDocuments: null,
        errorMSG: <div></div>,
    }
    handleChange = (e) => {
        console.log(e.target.value)
        this.setState({
            [e.target.id]: e.target.value,
        })
        console.log(this.state)
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
                            <a class="dropdown-item" onClick={() => { this.handleInputDocument(outputDocument, outputDocument.name) }}>{outputDocument.name}</a>
                        </div>
                    )
                })

            }
        })
        return x
    }
    searchForInputDocument = (Document) => {
        // console.log(Document)
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
                outputOf: logicalName
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
        return (
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemoveInputDocument(Document) }}>
                <i className="material-icons ">highlight_off</i>
            </button>
        )
    }
    handleRemoveInputDocument = (Document) => {
        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            Document: Document
        }
        console.log(payload)
        this.props.removeInputDocument(payload)
    }
    renderInputDocumentsButton = () => {
        return (
            <div class="dropdown">
                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                    Enter input documents
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
            console.log("null", "error")
            return
        }
        console.log(this.searchForOutputDocument(this.state.outputDocuments))
        if (this.searchForOutputDocument(this.state.outputDocuments)) {
            this.renderErrorMessage("redundant")
            console.log("redundant", "error")
            return
        }

        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            outputDocument: {
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
        if (isMemberAssigned(this.props.task, this.props.userInfo)) {
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
        console.log(payload)
        this.props.removeOutputDocument(payload)
    }
    render() {
        const text = makeid()
        return (
            <div>
                <button type="button" class="btn btn-secondary btn-sm" data-toggle="modal" data-target={"#" + text} >
                    Task document
                </button>
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
                                <div>
                                    <p>input Documents of this  task:</p>
                                    {this.renderInputDocumentsButton()}
                                </div>
                                <div>
                                    {this.renderInputDocumentsList()}
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Upload Input Document</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <UploadFile task={this.props.task} isInput={true} />
                                    </div>
                                </div>
                                <hr />
                                {this.state.errorMSG}
                                <input className="form-control" onChange={this.handleChange} placeholder={this.props.task.outputDocuments} id="outputDocuments" type="text" />
                                <button className="btn btn-primary" onClick={this.handleSubmitOutput}> submit</button>
                                <div>
                                    <p>output Documents of this task:</p>
                                    {this.renderOutput()}
                                </div>
                                {/* ahmad */}
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
        removeInputDocument: (payload) => dispatch(removeInputDocument(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskDocumentModal)