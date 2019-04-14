import React, { Component } from 'react'
import { connect } from 'react-redux'
import { newComment, checkActivity, removeDocument } from '../../store/actionCreators/taskActions'
import { makeid, isTaskPending, isTaskSubmitted, isMemberAssigned, isOutputTaskSubmitted, isTaskOfOutputSubmitted } from '../../helper'
import FileSaver from 'file-saver';
class TaskDetails extends Component {

    renderDescription = () => {
        if (this.props.task.description === '') {
            return
        }
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h5>Description</h5>
                        <p>{this.props.task.description}</p>
                    </div>
                </div>
                <hr />
            </div>
        )
    }
    renderPredecessorList = () => {
        const predecessorList = this.props.task.dependencies.predecessor.map(task => {
            return (
                <li>{task.taskName}</li>
            )
        })
        return predecessorList
    }
    renderSuccessorList = () => {
        const successorList = this.props.task.dependencies.predecessorTo.map(task => {
            return (
                <li>{task.taskName}</li>
            )
        })
        return successorList
    }
    renderDependencies = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h5>Dependencies</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label>Predecessor Tasks :</label>
                    </div>
                    <div className="col-3">
                        {this.renderPredecessorList()}
                    </div>
                    <div className="col-3"></div>
                    <div className="col-2"></div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label>Successor Tasks :</label>
                    </div>
                    <div className="col-2">
                        {this.renderSuccessorList()}
                    </div>
                </div>
                <hr />
            </div>
        )
    }
    handleActivityCheck = (e, activity) => {
        console.log(e.target.checked)
        let payload
        if (!e.target.checked) {
            payload = {
                task: this.props.task,
                activity,
                project: this.props.projectInContext,
                status: "UNCHECKED"
            }
        }
        else {
            payload = {
                task: this.props.task,
                activity,
                project: this.props.projectInContext,
                status: "CHECKED"
            }
        }
        this.props.checkActivity(payload)
    }
    renderActivities = () => {
        if (this.props.task.activities.length === 0) {
            return
        }
        const activities = this.props.task.activities.map(activity => {
            if (activity.status === "CHECKED") {
                return (
                    <li>
                        <strike>{activity.name}</strike>
                        <input type="checkbox" checked onClick={(e) => { this.handleActivityCheck(e, activity) }} />
                    </li>

                )
            }
            else {
                return (
                    <li>
                        {activity.name}
                        <input type="checkbox" onClick={(e) => { this.handleActivityCheck(e, activity) }} />
                    </li>
                )
            }
        })
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <h5>Task Activities</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <ol>
                            {activities}
                        </ol>
                    </div>
                </div>
                <hr />
            </div>
        )
    }
    handleRemoveDocument = (document, isInput) => {
        const payload = {
            document,
            isInput,
            project: this.props.projectInContext,
            task: this.props.task
        }
        this.props.removeDocument(payload)
    }
    renderRemoveDocumentButton = (document, isInput) => {
        return (
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemoveDocument(document, isInput) }}>
                <i className="material-icons ">highlight_off</i>
            </button>
        )
    }
    renderInputDocuments = () => {
        
        const documentsList = this.props.task.inputDocuments.map(element => {
            if(element.deleted ){
                return
            }
            if(element.file === ""){
                return (
                    <li>{element.name}</li>
                )
            }
            if(element.isImported || element.uploadedFromDisk){
                return(
                    <li><a target="_blank" href={element.file}>{element.name}</a></li>
                )
            }
            if(isTaskOfOutputSubmitted(element, this.props.projectInContext)){
                return(
                    <li><a target="_blank" href={element.file}>{element.name}</a></li>
                )
            }
            else{
                return (
                    <li>{element.name}</li>
                )
            }
        })
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <h5>Input Documents</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <ul>
                            {documentsList}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
    renderOutputDocuments = () => {

        const documentsList = this.props.task.outputDocuments.map(element => {
            if (element.file !== "" && (isTaskSubmitted(this.props.task._id, this.props.projectInContext) || isTaskPending(this.props.task._id, this.props.projectInContext))) {
                return (
                    <li><a target="_blank" href={element.file}>{element.name}</a></li>
                )
            }
            if (element.file !== ""  && isMemberAssigned(this.props.task, this.props.userInfo)) {
                return (
                    <li><a target="_blank" href={element.file}>{element.name}</a></li>
                )
            }
            else {
                return (
                    <li>{element.name}</li>
                )
            }
        })
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <h5>Output Documents</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <ul>
                            {documentsList}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
    render() {

        let text = makeid()
        var startDate = this.props.task.startDate
        var date,time
    //  this.props.task.startDate ? (date = this.props.task.startDate.split("T")) : (date = "not specified yet")
     if(typeof this.props.task.startDate === "undefined"){
        startDate = "not specified yet"
     }
     else{
        date = startDate.split("T")
        time = date[1].split(":")[0] + ":" + date[1].split(":")[1]

     }
        return (
            <div>
                <button type="button" class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target={"#" + text} >
                    Task Details
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
                                <div className="row">
                                    <div className="col-12">
                                        <label>Start Date :{date[0]} {time}</label>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="col-12">
                                        <label>End Date : {date[0]} {time} </label>
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="col-4">
                                        <label>Duration: {this.props.task.duration} Days</label>
                                    </div>
                                </div>
                                <hr />
                                {this.renderDescription()}
                                {this.renderDependencies()}
                                {this.renderActivities()}
                                {this.renderInputDocuments()}
                                {this.renderOutputDocuments()}
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
        userInfo: state.userInfo,
        projectInContext: state.projectInContext
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        newComment: (comment, task, project) => dispatch(newComment(comment, task, project)),
        checkActivity: payload => dispatch(checkActivity(payload)),
        removeDocument: payload => dispatch(removeDocument(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails)