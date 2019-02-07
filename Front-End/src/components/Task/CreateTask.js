import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'

class CreateTask extends Component {
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
                                <form onSubmit={this.handleCreateTask}>
                                    <div class="form-group">
                                        <label for="Task name">Task name</label>
                                        <input class="form-control" id="Task name" placeholder="Task name" />

                                        <label for="Task description">Task description</label>
                                        <textarea class="form-control" id="Task description" rows="3" placeholder="Task description"></textarea><br />
                                        <div className="centered">
                                            <label className="label" htmlFor="Start date">Start Date: </label>
                                            <DatePicker id="Start date" /><br /><br />
                                        </div>
                                        <label className="label" htmlFor="End date">End date: </label>
                                        <DatePicker id="End date" />
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

export default CreateTask;