import React, { Component } from 'react'
import { connect } from 'react-redux'
import { makeid } from '../../helper'
import { handleOutput, removeOutputFile } from '../../store/actionCreators/taskActions'
import UploadFile from './UploadFile';
import UploadOutput from './UploadOutput';

class TaskDocumentModal extends Component {
    state = {
        outputFiles: ""
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }
    renderInputDocuments = () => {
        const inputFiles = this.props.projectInContext.tasks.map(task => {
            
            if(this.props.task === task){return}
            if(task.outputFiles.length === 0){
                return
            }else{
                return (
                    
                        <a class="dropdown-item">{task.outputFiles}</a>
                   
                )
            }
        })
        return inputFiles
    }
    handleInputDocument = () => {
        console.log("still working on it :)")
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
    // searchForOutputFile = (file) => {
    //     const outputFiles = this.props.task.outputFiles
    //     console.log(outputFiles.find(Ofile => { return Ofile === file }))
    //     if (outputFiles.find(Ofile => { return Ofile === file })) { return false }
    //     else { return true }
    // }
    handleSubmitOutput = (e) => {
        if(document.getElementById("outputFiles").value === ""){
            this.renderErrorMessage("null")
            console.log("null","error")
            return
        }
        // if(this.searchForOutputFile(this.state.outputFiles)){
        //     this.renderErrorMessage("redundant")
        //     console.log("redundant","error")
        //     return
        // }
        // console.log("didnt work")
        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            outputFile: this.state.outputFiles
        }
        
        this.props.handleOutput(payload)
    }
    renderErrorMessage = (type) => {
        let error
        if(type === "null"){
            console.log("errrrrrroorororo")
            error = <div className="alert alert-danger" role="alert">Please type something!</div>
        }
        if(type === "redundant"){
            error = <div className="alert alert-danger" role="alert">this outputfile is already exists!</div>
        }
        return error
    }
    renderOutput = () => {
        const outputFiles = this.props.task.outputFiles.map(file => {
            return(
                <div>
                    <p>{file}{this.renderRemoveOutputFile(file)} <span><UploadOutput task ={this.props.task} isInput={false} documentName={file} /></span></p>
                </div>
            )
        })
        return outputFiles
    }
    renderRemoveOutputFile = (file) => {
        return (
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemoveOutputFile(file) }}>
                <i className="material-icons ">highlight_off</i>
            </button>
        )
    }
    handleRemoveOutputFile = (file) => {
        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            file: file
        }
        console.log(payload)
        this.props.removeOutputFile(payload)
    }
    render() {
        const text = makeid()
        return (
            <div>
                {   window.scroll({
                    top: 2500, 
                    left: 0, 
                    behavior: 'smooth'
                })}
                <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target={"#" + text} >
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
                                    <p>input files of this  task:</p>
                                    {this.renderInputDocumentsButton()}
                                </div>
                                <hr />
                                    {() => {this.renderErrorMessage()}}
                                    <input className="form-control" onChange={this.handleChange} placeholder={this.props.task.outputFiles} id="outputFiles" type="text" />
                                    <button className="btn btn-primary" onClick={this.handleSubmitOutput}> submit</button>
                                    <div>
                                        <p>output files of this task:</p>
                                        {this.renderOutput()}
                                    </div>
                                {/* ahmad */}
                                <hr />
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Upload Input File</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <UploadFile task = {this.props.task} isInput={true}/>
                                    </div>
                                </div>
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
        removeOutputFile: (payload) => dispatch(removeOutputFile(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskDocumentModal)