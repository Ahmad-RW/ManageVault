import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import { setProject } from '../../store/actionCreators/projectActions'
import { deleteTask, submitTask, confirmTaskSubmission, watchTask, unWatchTask } from '../../store/actionCreators/taskActions'
import { checkAuthority, isMemberAssigned, isUserTeamLeader } from '../../helper'
import TaskDetails from './TaskDetails';
import ModifyTask from './ModifyTask'
import CommentsModal from './CommentsModal'
import TaskDocumentModal from './TaskDocumentModal'

class Board extends Component {
    constructor(props) {
        super(props)
    }
    handleDelete = (task_id) => {
        console.log(task_id)
        this.props.deleteTask(task_id, this.props.projectInContext._id)
    }
    renderDeleteTask = (task) => {
        if (checkAuthority(this.props.projectInContext, "DELETE_TASK", this.props.userInfo)) {
            return (
                <button className="close deleteTask" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleDelete(task._id, this.props.projectInContext._id) }} key={task._id}>
                    <i className="material-icons">highlight_off</i>
                </button>
            )
        }
    }
    renderCreateTaskButton = () => {
        if(checkAuthority(this.props.projectInContext,"CREATE_TASK" ,this.props.userInfo)){
            return ( 
                <CreateTask project={this.props.projectInContext} />
            )
        }
    }
    renderConfirmSubmissionButton = (task) => {
        if (checkAuthority(this.props.projectInContext, "CONFIRM_TASK_SUBMISSION", this.props.userInfo) && task.status === "PENDING_FOR_CONFIRMATION") {
            console.log(this.props.userInfo, "USER_INFO")
            return (<div>
                    <button className="btn btn-info btn-sm" onClick={() => { this.confirmTaskSubmission(task) }}>Confirm Submission</button>
                    </div>
                // <td>
                //     <button className="btn btn-danger btn-sm"></button>
                // </td>
            )
        }
    }
  
    renderSubmissionButton = (task) => {
        if(task.status === "PENDING_FOR_CONFIRMATION"){
            return
        }
        else if (task.status !== "SUBMITTED" && isMemberAssigned(task, this.props.userInfo)) {
            return (<div>
                <button className="btn btn-info btn-sm" onClick={() => { this.handleTaskSubmission(task) }}>Submit Task</button>
                </div>
            )
        }
    }
    handleTaskSubmission = (task) => {
        console.log(task)
        var endDate = new Date().getDate()
        console.log(endDate, "SUBMISSON DATE")
        const payload = {
            task,
            project: this.props.projectInContext,
            endDate: endDate
        }
        if(isUserTeamLeader(this.props.userInfo, this.props.projectInContext)){
            this.props.confirmTaskSubmission(payload)
            return;
        }
        this.props.submitTask(payload)
    }
    confirmTaskSubmission = (task) => {
        var endDate = new Date().getDate()
        const payload = {
            task,
            project: this.props.projectInContext,
            endDate: endDate
        }
        this.props.confirmTaskSubmission(payload)
    }
    setTaskLength = () =>{
        var tasks = this.props.projectInContext.tasks
        this.setState({
            taskLength:tasks.length
        })
    }
    renderTasks = () => {
        let number = 0
        let taskList
        var tasks = this.props.projectInContext.tasks
        taskList = tasks.length ? (
            tasks.map(task => {
                let rowColor = ""
                let taskStatus = ""
                console.log(task.status,"STATUS")

                if(task.status==="SUBMITTED"){rowColor="table-success";taskStatus = "Done"}
                else if(task.status==="PENDING_FOR_CONFIRMATION"){rowColor="table-warning";taskStatus = "Waiting for Confirmation"}
                else {rowColor="";taskStatus="To Do"}
                return (
                    <tr className={rowColor}>
                        <th scope="row">{++number}</th>
                        <td>
                            {task.name}
                        </td>
                        <td>
                            <div>{taskStatus}</div>
                        </td>
                        <td>
                            {this.renderSubmissionButton(task)}{this.renderConfirmSubmissionButton(task)} 
                        </td>
                        <td>
                            <TaskDetails task={task} number={number} />
                        </td>
                        <td>
                            <CommentsModal task = {task} />
                        </td>
                        <td>
                            <TaskDocumentModal task = {task} />
                        </td>
                        <td><ModifyTask tasks={tasks} task={task} /></td>
                        <td>{this.renderWatchTask(task)}</td>
                        <td>{this.renderDeleteTask(task)}</td>

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
                <img className="noTasks" src={require('../../No-Tasks.png')} width="350" height="350"/>
            )
    }
    renderWatchTask = (task) => {
        let found
        task.watchedBy.forEach(email => {
            if(this.props.userInfo.email === email){found = true}
            else {found = false}
        })
        if(!found){
            return (
                <button className="close watchTask" onClick={() => {this.handleWatchTask(task)}}> <i className="material-icons">visibility</i> </button>
            )
        } else {
            return (
                <button className="close" onClick={() => {this.handleUnWatchTask(task)}}> <i class="material-icons">visibility_off</i> </button>
            )
        }
        
    }
    handleWatchTask = (task) => {
        const payload = {
            task : task,
            project : this.props.projectInContext,
            member : this.props.userInfo
        }
        this.props.watchTask(payload)
    }
    handleUnWatchTask = (task) => {
        const payload = {
            task : task,
            project : this.props.projectInContext,
            member : this.props.userInfo
        }
        this.props.unWatchTask(payload)
    }
    render() {
        let tasks = this.props.projectInContext.tasks.length ? (
             <div>
                <ProjectSubBar />
                <div className="table-responsive">
                <table class="table table-hover table-sm ">
                    <thead>
                        <tr>
                            <th scope="col">Task Number</th>
                            <th scope="col">Task Name</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody className="">
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
        unWatchTask: (payload) => dispatch(unWatchTask(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)