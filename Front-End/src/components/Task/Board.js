import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import { setProject } from '../../store/actionCreators/projectActions'

class Board extends Component {
    constructor(props) {
        super(props)
    }
    handleDelete = (e) => {
        console.log(e, ", Click recorded")
        
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
                            <button className="close" data-dismiss="alert" aria-label="Close"  onClick={() => {this.handleDelete()}}>
                                <i className="material-icons">highlight_off</i>
                            </button>
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
                <CreateTask project={this.props.projectInContext} />
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