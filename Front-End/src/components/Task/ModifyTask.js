import React, { Component } from 'react'
import { makeid } from '../../helper'
import DatePicker from "react-datepicker";
import { element } from 'prop-types';

class ModifyTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task_Name: "",
            task_Description: "",
            startDate: new Date(),
            duration: "",
            predecessor : "",
            successor : "",

            redirect: false,

        }

    }

    handleDateChange = (date) => {//for DATEPICKER
        this.setState({
            startDate: date
        });
    }

    handleChange = (e) => {
        console.log(e.target.value)
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleSubmit() {

    }
    renderPredecessorList = () => {
        let tmp = ""
        this.props.task.dependencies.predecessor.forEach(element => {
            tmp = tmp.concat(" ", element, ",")
        })
        return tmp
    }
    renderSuccessorList = () => {
        let tmp = ""
        this.props.task.dependencies.successor.forEach(element => {
            tmp = tmp.concat(" ", element, ",")
        })
        return tmp
    }
    render() {
        let text = makeid()
        return (
            <div>
                <button className="close" aria-label="Close" data-toggle="modal" data-target={"#" + text}>
                    <i class="material-icons">edit</i>
                </button>
                <div class="modal fade" id={text} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{this.props.task.name}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div className="row">
                                    <div className="col-3">
                                        <label>Name: {this.props.task.name}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3">
                                        <label>Description: </label>
                                        <input type="text" value={this.props.task.description} readOnly/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3">
                                        <label>Duration: {this.props.task.duration}</label>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Dependencies</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <label>Predecessor Tasks :</label>
                                    </div>
                                    <div className="col">
                                        <input type="text" onChange={this.handleChange} id="predecessor" placeholder={this.renderPredecessorList()} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <label>Successor Tasks :</label>
                                    </div>
                                    <div className="col">
                                        <input type="text" id="successor" onChange={this.handleChange} placeholder={this.renderSuccessorList()} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col align-self-end">
                                        <button className="btn btn-primary btn-sm">Set Dependencies</button>
                                    </div>
                                </div>
                                <hr />
                                ...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModifyTask