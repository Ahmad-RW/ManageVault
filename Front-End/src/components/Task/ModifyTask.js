import React, { Component } from 'react'
import { makeid } from '../../helper'
import DatePicker from "react-datepicker";
import {connect } from 'react-redux'
import {setDependancy , editTask} from '../../store/actionCreators/taskActions'
class ModifyTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            startDate: this.props.task.startDate,
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
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleEdit = () => {
        const payload = {
            name: this.state.name,
            description: this.state.description,
            startDate: this.state.startDate,
            duration: this.state.duration,
            project: this.props.projectInContext,
            task : this.props.task,
        }
        console.log(payload)
        this.props.editTask(payload)
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
    setDependancy = () =>{
        const payload = {
            predecessors : this.state.predecessor,
            successor  : this.state.successor,
            task : this.props.task,
            project : this.props.projectInContext
        }
        this.props.setDependancy(payload)
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
                                <div class="form-group">
                                    <label for="name">Task name</label>
                                    <input type="text" class="form-control" id="name" placeholder={this.props.task.name} onChange={this.handleChange} required/>

                                    <label for="Description">Task description</label>
                                    <textarea class="form-control" id="Description" rows="3" placeholder={this.props.task.description} onChange={this.handleChange}></textarea><br /><br />

                                    <div className="centered">
                                        <label className="label" htmlFor="startDate">Start Date: </label>
                                        <DatePicker className="form-control" selected={this.state.startDate} onChange={this.handleDateChange} /><br /><br />
                                        <label className="label" htmlFor="Duration">Duration: </label>
                                        <input id="duration" onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col align-self-end">
                                        <button className="btn btn-primary btn-sm" onClick={this.handleEdit}>edit task</button>
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
                                        <button className="btn btn-primary btn-sm" onClick={this.setDependancy}>Set Dependencies</button>
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

const mapDispatchToProps = (dispatch) =>{
    return {
        setDependancy : (payload) =>{dispatch(setDependancy(payload))},
        editTask : (payload) => {dispatch(editTask(payload))}
    }
}

const mapStateToProps = (state) =>{
    return{
        projectInContext : state.projectInContext
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyTask)