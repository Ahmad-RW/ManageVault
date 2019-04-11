import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import { setProject } from '../../store/actionCreators/projectActions'
import { deleteTask, submitTask, confirmTaskSubmission, watchTask, unWatchTask, declineTaskSubmission } from '../../store/actionCreators/taskActions'
import { checkAuthority, isMemberAssigned, isUserTeamLeader, makeid } from '../../helper'
import TaskDetails from './TaskDetails';
import ModifyTask from './ModifyTask'
import CommentsModal from './CommentsModal'
import TaskDocumentModal from './TaskDocumentModal'
import Navbar from '../layout/Navbar'

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            feedback: "",
            wfcFilter:false,
            cardStyle:false
        }
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
                <div className="tooltips">
                <button title="Delete task" className="close deleteTask" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleDelete(task._id, this.props.projectInContext._id) }} key={task._id}>
                    <i className="material-icons">highlight_off</i>
                </button>
                <span className="tooltiptext">Delete Task</span>
                </div>
                
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
            const id = makeid()
            return (
                    <div className="submissionContainer">
                        <button data-toggle="modal" data-target={"#"+ id} className="btn btn-outline-danger btn-sm rejectSub" >Reject Submission</button>
                        {/*code below is a modal (which is triggered by the button above) for entering a feed back from the team leader */}
                        <div id = {id} class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
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
                    </div>
                    
                    
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
            <div className="tooltips">
                <i class="material-icons" title={task.feedback}>feedback</i>
                <span className="tooltiptext">{task.feedback}</span>
            </div>
            
        )
    }
    renderTasks = () => {
        let number = 0
        let taskList
        var tasks = this.props.projectInContext.tasks
        taskList = tasks.map(task => {
                let rowColor = ""
                let taskStatus = ""
                if (task.status === "SUBMITTED") { rowColor = "task-done"; taskStatus = "Done" }
                else if (task.status === "PENDING_FOR_CONFIRMATION") { rowColor = "task-wfc"; taskStatus = "Waiting for Confirmation" }
                else { rowColor = "task-todo"; taskStatus = "To Do" }
                if(this.state.wfcFilter === true){
                    rowColor = "task-wfc"
                    taskStatus = "Waiting for Confirmation"
                    if(task.status === "SUBMITTED" || task.status === "TO_DO"){
                        return
                    }
                }
                return (
                    <tr className={rowColor + " task taskBorder spaceUnder"} key={task._id}>
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
        return taskList

    }
    renderEmptyState = () => {
        return (
            <img className="noTasks" src={require('../../images/No-Tasks.png')} width="350" height="350" />
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
                <div className="tooltips">
                <button title="Watch task" className="close watchTask" onClick={() => { this.handleWatchTask(task) }}>
                    <i className="material-icons">visibility</i>
                </button>
                <span className="tooltiptext">Watch Task</span>
                </div>
            )
        } else {
            return (
                <div className="tooltips">
                <button title="Unwatch task" className="close" onClick={() => { this.handleUnWatchTask(task) }}>
                    <i class="material-icons">visibility_off</i>
                </button>
                <span className="tooltiptext">Unwatch Task</span>
                </div>
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
    changeTLview = () => {
        if(this.state.wfcFilter === true){
            this.setState({
                wfcFilter:false
            })
        }
        if(this.state.wfcFilter === false){
            this.setState({
                wfcFilter:true
            })
        }
    }
    
    renderToggleTLview = () => {
        if(isUserTeamLeader(this.props.userInfo,this.props.projectInContext) === false){return}
        return (
            <div className="location inlineElement">
            Team leader view
            <label className="switch">
                <input onClick={this.changeTLview} type="checkbox" />
                <span class="slider round"></span>
            </label>
            </div>
            
        )
    }
    renderChangeStyleSwitch = () =>{
        return (
            <div className="location2 inlineElement">
            Card style
            <label className="switch">
                <input onClick={this.changeStyle} type="checkbox" />
                <span class="slider round"></span>
            </label>
            </div>
        )
    }
    changeStyle = () => {
        if(this.state.cardStyle === true){
            this.setState({
                cardStyle:false
            })
        }
        if(this.state.cardStyle === false){
            this.setState({
                cardStyle:true
            })
        }
    }
    renderCardStyle = () =>{
        let number = 0
        let taskList
        var tasks = this.props.projectInContext.tasks
        taskList = tasks.map(task => {
                let rowColor = ""
                let taskStatus = ""
                if (task.status === "SUBMITTED") { rowColor = "task-done"; taskStatus = "Done" }
                else if (task.status === "PENDING_FOR_CONFIRMATION") { rowColor = "task-wfc"; taskStatus = "Waiting for Confirmation" }
                else { rowColor = "task-todo"; taskStatus = "To Do" }
                if(this.state.wfcFilter === true){
                    rowColor = "task-wfc"
                    taskStatus = "Waiting for Confirmation"
                    if(task.status === "SUBMITTED" || task.status === "TO_DO"){
                        return
                    }
                }
                return (
                    <div class="card" className="task-card inlineElement">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="#" class="btn btn-primary">Go somewhere</a>
                            </div>
                    </div>
                )
            })
        return taskList

    }
    render() {
        let tasks
        if(this.state.cardStyle === false){
            tasks = this.props.projectInContext.tasks.length ? (
                <div>
                <div>
                    {this.renderToggleTLview()}
                    {this.renderChangeStyleSwitch()}
                </div>
                    <div className="table-responsive tasksTableContainer">
                        <table class="table table-sm tasksList" id="albums" cellspacing="0">
                            <thead className="alert-secondary" >
                                <tr>
                                    <th className="tasksTableHeaderFirst" scope="col" width="70">Task Number</th>
                                    <th scope="col" width="350">Task Name</th>
                                    <th scope="col" width="200">Status</th>
                                    <th></th>
                                    <th></th><th></th><th></th><th></th><th></th><th></th><th className="tasksTableHeaderLast"></th>
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
        }
        else{
            tasks = this.props.projectInContext.tasks.length ? (
                <div>
                <div>
                    {this.renderToggleTLview()}
                    {this.renderChangeStyleSwitch()}
                </div>
                    {this.renderCardStyle()}
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
        }
        
        return (
            <div>
            <Navbar/>
            <ProjectSubBar />
                {tasks}
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
        deleteTask: (task_id, PID) => dispatch(deleteTask(task_id, PID)),
        submitTask: (payload) => dispatch(submitTask(payload)),
        confirmTaskSubmission: (payload) => dispatch(confirmTaskSubmission(payload)),
        watchTask: (payload) => dispatch(watchTask(payload)),
        unWatchTask: (payload) => dispatch(unWatchTask(payload)),
        declineTaskSubmission: payload => dispatch(declineTaskSubmission(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)