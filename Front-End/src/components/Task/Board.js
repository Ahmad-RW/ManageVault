import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import TaskTableHeader from './TaskTableHeader';
import {setProject} from '../../store/actionCreators/projectActions'

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentProject: this.props.location.state.project
        }
    }
    render() {
      
        var tasks = this.props.projectInContext.tasks//lvnejfbnvofebvfenbv
        if (typeof tasks === "undefined") {
            this.props.history.push('/')
        }
        const taskList = tasks.length ? (
            tasks.map(task => {
                return (
                    <h4>{task.name}</h4>
                )
            })
        ) : (
                <h4>There is no tasks  yet</h4>
            )

        return (
            <div>
                <ProjectSubBar />
                <TaskTableHeader />
                {taskList}
                {console.log(this.state.project, "هذا ايش؟")}
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
        setProject : (project) => dispatch(setProject(project))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)