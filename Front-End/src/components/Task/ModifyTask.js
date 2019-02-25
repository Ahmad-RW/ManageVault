import React, { Component } from 'react'
import { makeid } from '../../helper'
import DatePicker from "react-datepicker";
import {connect } from 'react-redux'
import {setDependancy , editTask, assignTask, newActivity} from '../../store/actionCreators/taskActions'

class ModifyTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            startDate: this.props.task.startDate,
            duration: "",
            predecessor: "",
            successor: "",
            redirect: false,
            activity : ""
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
            task: this.props.task,
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
    setDependancy = () => {
        const payload = {
            predecessors: this.state.predecessor,
            successor: this.state.successor,
            task: this.props.task,
            project: this.props.projectInContext
        }
        this.props.setDependancy(payload)
    }
    renderTeamMembers  = () => {
        const members = this.props.projectInContext.members.map(member => {
            return(
                <a class="dropdown-item" onClick={() => {this.handleAssign(member)}}>{member.name}</a>
            )
        })
        return members
    }
    handleAssign = (member) => {
        console.log(member,"member")
        const payload = {
            member : member,
            task : this.props.task,
            project : this.props.projectInContext
        }
        this.props.assignTask(payload)
    }
    renderAssignedMembers = () => {
        const assignedMembers = this.props.task.assignment.assignedMembers.map(name => {
            return(
                <div className="col">
                    <p>{name}</p>
                </div>
            )
        })
        return assignedMembers
    }
    handleActivityChange = (e) =>{
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    renderActivities = () => {
        console.log(this.props.task)
        const activites = this.props.task.activities.map(activity => {
            if (activity.status === "CHECKED") {
                return (
                    <li >
                        <strike>{activity.name}</strike>
                    </li>
                )
            }
            else {
                return (
                    <li>
                        {activity.name}
                    </li>
                )
            }
        })
        return activites
    }
    handleNewActivity = () =>{
        const activity = {
            name : this.state.activity,
            status : "UNCHECKED",
            date : new Date()
        }
        const payload = {
            activity : activity,
            task : this.props.task,
            project: this.props.projectInContext
        }
        this.props.newActivity(payload)
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
                                    <input type="text" class="form-control" id="name" placeholder={this.props.task.name} onChange={this.handleChange} required />

                                    <label for="Description">Task description</label>
                                    <textarea class="form-control" id="Description" rows="3" placeholder={this.props.task.description} onChange={this.handleChange}></textarea><br /><br />

                                    <div className="centered">
                                        <label className="label" htmlFor="startDate">Start Date: </label>
                                        <DatePicker className="form-control" selected={this.state.startDate} onChange={this.handleDateChange} /><br /><br />
                                        <label className="label" htmlFor="Duration">Duration: </label>
                                        <input id="duration" onChange={this.handleChange} />
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
                                        <h5>Assign members</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div class="dropdown">
                                        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            Assign member
                                        </button>
                                        <div class="dropdown-menu">
                                        {this.renderTeamMembers()}
                                        </div>
                                        {this.renderAssignedMembers()}
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
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Task Sub-Activities</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3">
                                        <ol className="list-group">
                                            {this.renderActivities()}
                                        </ol>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <input onChange={this.handleActivityChange} id="activity" type="text" placeholder="activity" />
                                    </div>
                                    <div className="col">
                                        <button className="btn btn-primary btn-sm" onClick={this.handleNewActivity}>Add Activity</button>
                                    </div>
                                </div>
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
        setDependancy : (payload) =>{dispatch(setDependancy(payload))},
        editTask : (payload) => {dispatch(editTask(payload))},
        assignTask : (payload) => {dispatch(assignTask(payload))},
        setDependancy: (payload) => { dispatch(setDependancy(payload)) },
        editTask: (payload) => { dispatch(editTask(payload)) },
        newActivity : (payload) => {dispatch(newActivity(payload))}
    }
}

const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyTask)