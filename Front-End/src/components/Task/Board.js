import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
import TaskTableHeader from './TaskTableHeader';
class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentProject: this.props.location.state.project
        }
    }
    render() {
      //  window.onbeforeunload = function() {return false}
        console.log(this.props.location.state.project)
        let project
        this.props.projects.forEach(element => {
            if(this.state.currentProject === element._id){
                project = {...element}
            }
            }) 
        var { tasks } = project//lvnejfbnvofebvfenbv
        if (typeof tasks === "undefined") {
            this.props.history.push('/')
        }
        const taskList = tasks.length ? (
            tasks.map(task => {
                return (
                    <div className="container-fluid-full">
                    <table class="table table-hover table-dark">
                        <tbody>
                            <tr>
                                <th>1</th>
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

        return (
            <div>
                <ProjectSubBar />
                <TaskTableHeader />
                {taskList}
                {console.log(this.state.project, "هذا ايش؟")}
                <CreateTask project={this.state.project} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.projectInContext,
        projects: state.projects
    }
}
export default connect(mapStateToProps)(Board)