import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import { setProject } from '../../store/actionCreators/projectActions'
import { deleteTask, submitTask, confirmTaskSubmission } from '../../store/actionCreators/taskActions'
import { checkAuthority, isMemberAssigned, isUserTeamLeader } from '../../helper'
import TaskDetails from './TaskDetails';
import ModifyTask from './ModifyTask'
import CommentsModal from './CommentsModal'
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
                <button className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleDelete(task._id, this.props.projectInContext._id) }} key={task._id}>
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
            return (
                <td>
                    <button className="btn btn-success btn-sm" onClick={() => { this.confirmTaskSubmission(task) }}>Confirm Submission</button>
                </td>
                // <td>
                //     <button className="btn btn-danger btn-sm"></button>
                // </td>
            )
        }
    }
  
    renderSubmissionButton = (task) => {
        if (task.status !== "SUBMITTED" && isMemberAssigned(task, this.props.userInfo)) {
            return (
                <button className="btn btn-success btn-sm" onClick={() => { this.handleTaskSubmission(task) }}>Submit Task</button>
            )
        }
    }
    handleTaskSubmission = (task) => {
        console.log(task)
        const payload = {
            task,
            project: this.props.projectInContext
        }
        if(isUserTeamLeader(this.props.userInfo, this.props.projectInContext)){
            this.props.confirmTaskSubmission(payload)
            return;
        }
        this.props.submitTask(payload)
    }
    confirmTaskSubmission = (task) => {
        const payload = {
            task,
            project: this.props.projectInContext
        }
        this.props.confirmTaskSubmission(payload)
    }
    renderTasks = () => {
        let number = 0
        let taskList
        var tasks = this.props.projectInContext.tasks
        taskList = tasks.length ? (
            tasks.map(task => {
                return (
                    <tr>
                        <th scope="row">{++number}</th>
                        <td>
                            {task.name}
                        </td>
                        <td>
                            {task.status}
                        </td>
                        <td>
                            {this.renderSubmissionButton(task)}
                        </td>
                        {this.renderConfirmSubmissionButton(task)}
                        <td>
                            <TaskDetails task={task} number={number} />
                        </td>
                        <td>
                            <CommentsModal task = {task} />
                        </td>
                        <td>
                            {this.renderDeleteTask(task)}
                            <ModifyTask tasks={tasks} task={task} />
                            
                        </td>

                    </tr>
                )
            })
        ) : (
                <h4>There are no tasks  yet</h4>
            )
        return taskList

    }
    render() {
        return (
            <div>
                <ProjectSubBar />

                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Task Number</th>
                            <th scope="col">Task Name</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTasks()}
                    </tbody>
                </table>
                {this.renderCreateTaskButton()}
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
        confirmTaskSubmission: (payload) => dispatch(confirmTaskSubmission(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)