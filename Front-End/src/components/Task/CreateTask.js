import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createTask } from '../../store/actionCreators/taskActions'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { calculateEndDate } from '../../helper'

class CreateTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            Description: "",
            startDate: new Date(),
            duration: "",
            redirect: false
        }
      }

      handleDateChange = (date) => {//for DATEPICKER
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
        var endDate = calculateEndDate(this.state.startDate, this.state.duration)
        console.log(endDate)
        let task = {
            name: this.state.name,
            status : "TO_DO",
            duration : this.state.duration,
            Description: this.state.Description,
            startDate: this.state.startDate,
        }
        console.log(this.props.project)
        console.log(task)
        if(this.state.name.length > 60 ){
            alert("task name is too long")
            return
        }
        if(this.state.name.length <3){
            alert("task name is too short")
            return
        }
        this.props.createTask(this.props.project, task)
    }

    render() {
        return (
            <div>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createTask">
                    Create task
                    </button>
                <div class="modal fade" id="createTask" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                        <label for="name">Task name</label>
                                        <input class="form-control" id="name" placeholder="Task name" onChange={this.handleChanges} required/>

                                        <label for="Description">Task description</label>
                                        <textarea class="form-control" id="Description" rows="3" placeholder="Task description" onChange={this.handleChanges}></textarea><br /><br />
                                        <div className="centered">
                                            <label className="label" htmlFor="startDate">Start Date: </label>
                                            <DatePicker className="form-control" selected={this.state.startDate} onChange={this.handleDateChange} /><br /><br />
                                        </div>
                                        <label className="label" htmlFor="Duration">Duration: </label>
                                        <input id="duration" onChange={this.handleChanges} required/>
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