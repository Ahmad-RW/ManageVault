import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import CreateTask from './CreateTask'

class Board extends Component {

    displayTasks = () => {
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
                <CreateTask />
            </div>
        )
    }
}

export default Board 