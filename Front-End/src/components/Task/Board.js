import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import { setProject } from '../../store/actionCreators/projectActions'
import { deleteTask, submitTask, confirmTaskSubmission, watchTask, unWatchTask, declineTaskSubmission } from '../../store/actionCreators/taskActions'
import { checkAuthority, isMemberAssigned, isUserTeamLeader } from '../../helper'
import TaskDetails from './TaskDetails';
import ModifyTask from './ModifyTask'
import CommentsModal from './CommentsModal'
import TaskDocumentModal from './TaskDocumentModal'

class Board extends Component {
    state = {
        feedback: ""
    }
    constructor(props) {

        super(props)
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value

        })
    }
    handleDelete = (task_id) => {
        this.props.deleteTask(task_id, this.props.projectInContext._id)
    }
    renderDeleteTask = (task) => {
        if (checkAuthority(this.props.projectInContext, "DELETE_TASK", this.props.userInfo)) {
            return (
                <button title="Delete task" className="close deleteTask" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleDelete(task._id, this.props.projectInContext._id) }} key={task._id}>
                    <i className="material-icons">highlight_off</i>
                </button>
            )
        }
    }
    renderCreateTaskButton = () => {
        if (checkAuthority(this.props.projectInContext, "CREATE_TASK", this.props.userInfo)) {
            return (
                <CreateTask project={this.props.projectInContext} />
            )
        }
    }
    renderConfirmSubmissionButton = (task) => {

        if (checkAuthority(this.props.projectInContext, "CONFIRM_TASK_SUBMISSION", this.props.userInfo) && task.status === "PENDING_FOR_CONFIRMATION") {

            return (
                <button className="btn btn-outline-info btn-sm SBM" onClick={() => { this.confirmTaskSubmission(task) }}>Accept Submission</button>
            )
        }
    }

    renderRejectSubmissionButton = (task) => {
        if (checkAuthority(this.props.projectInContext, "CONFIRM_TASK_SUBMISSION", this.props.userInfo) && task.status === "PENDING_FOR_CONFIRMATION") {
            // console.log(this.props.userInfo, "USER_INFO")
            return (
<<<<<<< HEAD
                <td >
                    <button data-toggle="modal" data-target=".bd-example-modal-sm" className="btn btn-info btn-sm" className="btn btn-success btn-sm" >Reject Submission</button>
                    {/*code below is a modal (which is triggered by the button above) for entering a feed back from the team leader */}
                    <div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
=======
                    <div className="submissionContainer">
                        <button data-toggle="modal" data-target=".bd-example-modal-sm" className="btn btn-outline-danger btn-sm rejectSub" >Reject Submission</button>
                        {/*code below is a modal (which is triggered by the button above) for entering a feed back from the team leader */}
                        <div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
>>>>>>> 8c25a8d3e8858a0978ffe538ba8fac91a8cd3b81
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                                <div className="modal-header">
                                    <div className="modal-title"><h5>Please Provide Feedback</h5></div>
                                </div>
                                <div clas="modal-body">
                                    <input type="text" onChange={this.handleChange} id="feedback" />
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary btn-sm" data-dismiss="modal" onClick={() => { this.declineTaskSubmission(task) }}>Reject Task</button>
                                    <button className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD
                </td>


=======
                    </div>
                    
                    
>>>>>>> 8c25a8d3e8858a0978ffe538ba8fac91a8cd3b81
            )
        }
    }

    arePredecessorsSubmitted = task => {
        var result = true
        this.props.projectInContext.tasks.forEach(element => {
            task.dependencies.predecessor.forEach(pred => {
                if (element._id === pred.taskId && element.status !== "SUBMITTED") {
                    result = false
                }
            })
        })
        return result
    }
    renderSubmissionButton = (task) => {
        if (task.status === "PENDING_FOR_CONFIRMATION") {
            return
        }
        else if (task.status !== "SUBMITTED" && isMemberAssigned(task, this.props.userInfo)) {
            if (!this.arePredecessorsSubmitted(task)) {
                return (
                    <div>
                        <button title="Not all predecessor tasks are submitted" className="btn btn-info btn-sm" onClick={() => { this.handleTaskSubmission(task) }} disabled>Submit Task</button>
                    </div>
                )
            }
            return (<div>
                <button className="btn btn-info btn-sm" onClick={() => { this.handleTaskSubmission(task) }}>Submit Task</button>
            </div>
            )
        }
    }
    handleTaskSubmission = (task) => {

        let payload = {
            task,
            project: this.props.projectInContext,
            userInfo: this.props.userInfo
        }
        if (isUserTeamLeader(this.props.userInfo, this.props.projectInContext)) {
            payload = { ...payload, endDate: new Date() }
            this.props.confirmTaskSubmission(payload)
            return;
        }
        this.props.submitTask(payload)
    }
    confirmTaskSubmission = (task) => {
        var endDate = new Date()

        const payload = {
            task,
            project: this.props.projectInContext,
            endDate: endDate
        }
        this.props.confirmTaskSubmission(payload)
    }

    declineTaskSubmission = task => {
        if (this.state.feedback === "") {
            alert("feedback is required")
            return
        }
        const payload = {
            task,
            project: this.props.projectInContext,
            feedback: this.state.feedback
        }

        this.props.declineTaskSubmission(payload)
    }
    setTaskLength = () => {
        var tasks = this.props.projectInContext.tasks
        this.setState({
            taskLength: tasks.length
        })
    }
    renderFeedback = (task) => {

        if (task.feedback === "") {
            return
        }
        return (
            <i class="material-icons" title={task.feedback}>
                feedback
            </i>
        )
    }
    renderTasks = () => {
        let number = 0
        let taskList
        var tasks = this.props.projectInContext.tasks
        taskList = tasks.length ? (
            tasks.map(task => {
                let rowColor = ""
                let taskStatus = ""


                if (task.status === "SUBMITTED") { rowColor = "table-success"; taskStatus = "Done" }
                else if (task.status === "PENDING_FOR_CONFIRMATION") { rowColor = "table-warning"; taskStatus = "Waiting for Confirmation" }
                else { rowColor = ""; taskStatus = "To Do" }
                return (
                    <tr className={rowColor + " taskBorder spaceUnder"}>
                        <th scope="row" width="10" id="taskNumber">{++number}</th>
                        <td>
                            {task.name}
                        </td>
                        <td>
                            {taskStatus}
                        </td>
                        <td>
                            {this.renderSubmissionButton(task)}{this.renderConfirmSubmissionButton(task)}{this.renderRejectSubmissionButton(task)}
                        </td>
                        <td>
                            {this.renderFeedback(task)}
                        </td>
                        <td>
                            <TaskDetails task={task} number={number} />
                        </td>
                        <td>
                            <CommentsModal task={task} />
                        </td>
                        <td>
                            <TaskDocumentModal task={task} />
                        </td>
                        <td><ModifyTask tasks={tasks} task={task} /></td>
                        <td>{this.renderWatchTask(task)}</td>
                        <td id="lastTB">{this.renderDeleteTask(task)}</td>

                    </tr>
                )
            })
        ) : (
                <div>
                    {/* <h4>There are no tasks  yet</h4> */}

                </div>
            )
        return taskList

    }
    renderEmptyState = () => {
        return (
            <img className="noTasks" src={require('../../No-Tasks.png')} width="350" height="350" />
        )
    }
    renderWatchTask = (task) => {
        let found
        task.watchedBy.forEach(email => {
            if (this.props.userInfo.email === email) { found = true }
            else { found = false }
        })
        if (!found) {
            return (
                <button title="Watch task" className="close watchTask" onClick={() => { this.handleWatchTask(task) }}> <i className="material-icons">visibility</i> </button>
            )
        } else {
            return (
                <button title="Unwatch task" className="close" onClick={() => { this.handleUnWatchTask(task) }}> <i class="material-icons">visibility_off</i> </button>
            )
        }

    }
    handleWatchTask = (task) => {
        const payload = {
            task: task,
            project: this.props.projectInContext,
            member: this.props.userInfo
        }
        this.props.watchTask(payload)
    }
    handleUnWatchTask = (task) => {
        const payload = {
            task: task,
            project: this.props.projectInContext,
            member: this.props.userInfo
        }
        this.props.unWatchTask(payload)
    }
    render() {
        let tasks = this.props.projectInContext.tasks.length ? (
            <div>
                <ProjectSubBar />
                <div className="table-responsive tasksTableContainer">
                    <table class="table table-hover table-sm tasksList" id="albums" cellspacing="0">
                        <thead className="alert-secondary" >
                            <tr>
                                <th scope="col" width="70">Task Number</th>
                                <th scope="col" width="350">Task Name</th>
                                <th scope="col" width="200">Status</th>
                                <th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>
                            </tr>
                        </thead>
                        <tbody className="alert-secondary">
                            {this.renderTasks()}
                        </tbody>
                    </table>
                </div>
                {this.renderCreateTaskButton()}
                <div id="footer"></div>
            </div>

        ) : (
                <div>
                    <ProjectSubBar />
                    {this.renderEmptyState()}
                    {this.renderCreateTaskButton()}
                </div>
            )
        return (
            tasks
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
        deleteTask: (task_id, PID) => dispatch(deleteTask(task_id, PID)),
        submitTask: (payload) => dispatch(submitTask(payload)),
        confirmTaskSubmission: (payload) => dispatch(confirmTaskSubmission(payload)),
        watchTask: (payload) => dispatch(watchTask(payload)),
        unWatchTask: (payload) => dispatch(unWatchTask(payload)),
        declineTaskSubmission: payload => dispatch(declineTaskSubmission(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)