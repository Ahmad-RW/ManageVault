import React, { Component } from 'react'
import { connect } from 'react-redux'
import { makeid } from '../../helper'
import { handleOutput } from '../../store/actionCreators/taskActions'
import UploadFile from './uploadFile';

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
        console.log("here")
        const inputFiles = this.props.projectInContext.tasks.map(task => {
            return (
                <div>
                    <label htmlFor="inputFile">{task.outputFiles}</label>
                    <input id="inputFile" type="checkbox" />
                </div>
            )
        })
        return inputFiles
    }
    handleSubmitOutput = (e) => {
        e.preventDefault()
        const payload = {
            task: this.props.task,
            project: this.props.projectInContext,
            outputFile: this.state.outputFiles
        }
        console.log(payload, "payload")
        this.props.handleOutput(payload)
    }
    render() {
        const text = makeid()
        return (
            <div>
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
                                <form >
                                    {this.renderInputDocuments()}
                                </form>
                                <hr />
                                <form onSubmit={this.handleSubmitOutput}>
                                    <input className="form-control" onChange={this.handleChange} placeholder={this.props.task.outputFiles} id="outputFiles" type="text" />
                                    <button className="btn btn-primary" type="submit"> submit</button>
                                </form>

                                {/* ahmad */}
                                <hr />
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Upload Input File</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <UploadFile task = {this.props.task} inputDocument={true}/>
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

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskDocumentModal)