import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import CreateTask from './CreateTask'

class Board extends Component {

    displayTasks = () => {
        console.log(this.props.project)
        var { tasks } = this.props.project
        if (typeof tasks === "undefined") {
            tasks = []
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
        return taskList
    }

    render() {
        return (
            <div>
                {this.displayTasks()}
                {console.log(this.props.project._id,"هذا ايش؟")}
                <CreateTask project={this.props.project}/>
            </div>
        )
    }
}

export default Board 