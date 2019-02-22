import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import { setProject } from '../../store/actionCreators/projectActions'
import { deleteTask } from '../../store/actionCreators/taskActions'
import { checkAuthority } from '../../helper' 
import TaskDetails from './TaskDetails';

class Board extends Component {
    constructor(props) {
        super(props)
    }
    handleDelete = (task_id) => {
        console.log(task_id)
        this.props.deleteTask(task_id, this.props.projectInContext._id)
    }
    renderDeleteTask = (task) => {
        if(checkAuthority(this.props.projectInContext,"DELETE_TASK",this.props.userInfo)){
           return ( 
                <button className="close" data-dismiss="alert" aria-label="Close"  onClick={() => {this.handleDelete(task._id, this.props.projectInContext._id)}} key={task._id}>
                    <i className="material-icons">highlight_off</i>
                </button>
           )
        }
    }
    renderCreateTaskButton = (task) => {
        if(checkAuthority(this.props.projectInContext,"DELETE_TASK",this.props.userInfo)){
            return ( 
                <CreateTask project={this.props.projectInContext} />
            )
         } 
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
                    <td>{task.name}</td>
                    <td>
                            <TaskDetails task = {task} number={number}/>
                        </td>
                    <td>
                            {this.renderDeleteTask(task)}
                    </td>
                </tr>
                )
            })
        ) : (
                <h4>There is no tasks  yet</h4>
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
                            <th scope="col">Task Number</th>
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
        getCurrentProject: (projectId) => dispatch({ type: "GET_CURRENT_PROJECT", projectId }),
        setProject: (project) => dispatch(setProject(project)),
        deleteTask: (task_id,PID) => dispatch(deleteTask(task_id,PID))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)