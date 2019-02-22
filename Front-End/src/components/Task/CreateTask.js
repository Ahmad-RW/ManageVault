import React, { Component } from 'react'
import { connect } from 'react-redux'

import { createTask } from '../../store/actionCreators/taskActions'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
class CreateTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task_Name: "",
            task_Description: "",
            startDate: new Date(),
            duration: "",
            redirect: false
        };
        this.handleChange = this.handleChange.bind(this);
      }

    handleChange(date) {
        this.setState({
          startDate: date
        });
    }

    handleChanges = (e) => {
        console.log(e.target.value)
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log("in submit")
        let task = {
            name: this.state.task_Name,
            status : "TO_DO",
            duration : this.state.duration,
            task_Description: this.state.task_Description,
            startDate: this.state.startDate,
        }
        // this.setState({
        //     task_Name: '',
        //     task_Description: '',
        // })
        console.log(this.props.project)
        console.log(task)
        this.props.createTask(this.props.project, task)
    }

    render() {
        
        return (
            <div>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createTask">
                    Create task
                    </button>
                <div class="modal fade" id="createTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                        <input class="form-control" id="task_Name" placeholder="Task name" onChange={this.handleChanges} required/>

                                        <label for="task_Description">Task description</label>
                                        <textarea class="form-control" id="task_Description" rows="3" placeholder="Task description" onChange={this.handleChanges}></textarea><br />
                                        <div className="centered">
                                            <label className="label" htmlFor="startDate">Start Date: </label>
                                            <DatePicker className="form-control" selected={this.state.startDate} onChange={this.handleChange} /><br /><br />
                                        </div>
                                        <label className="label" htmlFor="Duration">Duration: </label>
                                        <input id="duration" onChange={this.handleChanges}/>
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