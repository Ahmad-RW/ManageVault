import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import TaskTableHeader from './TaskTableHeader';
import { setProject } from '../../store/actionCreators/projectActions'

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentProject: localStorage.getItem("currentProject")
        }
        console.log(this.props.projectInContext)
        console.log(localStorage.getItem("currentProject"))
    }
    render() {
        let taskList
        let currentProject
        this.props.projects.forEach(project => {
            if (project._id === localStorage.getItem("currentProject")) {
                currentProject = { ...project }
            }
        });
        console.log(currentProject)
        if (typeof currentProject === "undefined") {
            var tasks = this.props.projectInContext.tasks//lvnejfbnvofebvfenbv
            if (typeof tasks === "undefined") {
                tasks = []
            }
            taskList = tasks.length ? (
                tasks.map(task => {
                    return (
                        <h4>{task.name}</h4>
                    )
                })
            ) : (
                    <h4>There is no tasks  yet</h4>
                )
        }
        else {
            var tasks = currentProject.tasks//lvnejfbnvofebvfenbv
            console.log(currentProject)
            if (typeof tasks === "undefined") {
                tasks = []
            }
            taskList = tasks.length ? (
                tasks.map(task => {
                    return (
                        <div className="container-fluid-full">
                        <table className="table table-hover table-dark">
                        <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>{task.name}</td>
                                </tr>
                        </tbody>
                        </table>
                        </div>
                    )
                })
            ) : (
                    <h4>There is no tasks  yet</h4>
                )
        }
        return (
            <div>
                <ProjectSubBar />
                <TaskTableHeader />
                {taskList}
                <CreateTask project={currentProject} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext,
        projects: state.projects

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getCurrentProject: (projectId) => dispatch({ type: "GET_CURRENT_PROJECT", projectId }),
        setProject: (project) => dispatch(setProject(project))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)