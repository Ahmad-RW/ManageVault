import React, { Component } from 'react'

import DatePicker from "react-datepicker";

class ModifyTask extends Component {
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

    handleSubmit() {

    }

    render() {
        console.log(this.props.tasks,"tasks")
        console.log(this.props.task)
        return (
            <div>
                <button className="close"  aria-label="Close" data-toggle="modal" data-target="#modifyTask">
                    <i class="material-icons">edit</i>
                </button>
                <div class="modal fade" id="modifyTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{this.props.task.name}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div class="form-group">
                                        <label for="task_Name">Task name</label>
                                        <input class="form-control" id="task_Name" value={this.props.task.name} onChange={this.handleChanges} required/>

                                        <label for="task_Description">Task description</label>
                                        <textarea class="form-control" id="task_Description" rows="3" value={this.props.task.description} onChange={this.handleChanges}></textarea><br />
                                        <div className="centered">
                                            <label className="label" htmlFor="startDate">Start Date: </label>
                                            <DatePicker className="form-control" selected={this.state.startDate} onChange={this.handleChange} /><br /><br />
                                        </div>
                                        <label className="label" htmlFor="Duration" value={this.props.task.duration}>Duration: </label>
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

export default ModifyTask