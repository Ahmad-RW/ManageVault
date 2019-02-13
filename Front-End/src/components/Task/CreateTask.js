import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import { createTask } from '../../store/actionCreators/taskActions'

class CreateTask extends Component {
    state = {
        task_Name: "",
        task_Description: "",
        startDate: "",
        endDate: "",
        redirect: false
    }

    handleChange = (e) => {
        console.log(e.target.value)
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log("in submit")
        let task = {
            name: this.state.task_Name,
            task_Description: this.state.task_Description,
            startDate: this.state.startDate,
            deadLine: this.state.endDate,
        }
        console.log(this.props.project,"نل ولا مو نل؟")
        this.props.createTask(this.props.project, task)
    }

    render() {
        
        return (
            <div>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    Create task
                    </button>
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Create task</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div class="form-group">
                                        <label for="task_Name">Task name</label>
                                        <input class="form-control" id="task_Name" placeholder="Task name" onChange={this.handleChange} required/>

                                        <label for="task_Description">Task description</label>
                                        <textarea class="form-control" id="task_Description" rows="3" placeholder="Task description" onChange={this.handleChange}></textarea><br />
                                        <div className="centered">
                                            <label className="label" htmlFor="startDate">Start Date: </label>
                                            <DatePicker id="startDate" onChange={this.handleChange}/><br /><br />
                                        </div>
                                        <label className="label" htmlFor="endDate">End date: </label>
                                        <DatePicker id="endDate" onChange={this.handleChange}/>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary">Create</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createTask: (project, task) => { dispatch(createTask(project, task)) },
    }
}

export default connect(null,mapDispatchToProps)(CreateTask);