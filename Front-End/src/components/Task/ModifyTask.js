import React, { Component } from 'react'
import { makeid, isMemberAssigned } from '../../helper'
import DatePicker from "react-datepicker";
import { connect } from 'react-redux'
import { setDependancy, editTask, assignTask, newActivity, unAssignTask, removeDependency, newCriteria } from '../../store/actionCreators/taskActions'
import { checkAuthority } from '../../helper'


class ModifyTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.task.name,
            description: this.props.task.description,
            startDate: this.props.task.startDate,
            duration: this.props.task.duration,
            predecessor: "",
            successor: "",
            redirect: false,
            activity: "",
            submissionCriteria: ""
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
            task: this.props.task
        }

        this.props.editTask(payload)
    }
    setDependancy = (task) => {
        const payload = {
            predecessorTask: task,
            taskInContext: this.props.task,
            project: this.props.projectInContext
        }
        this.props.setDependancy(payload)
    }
    renderTaskDropdown = () => {
        let flag = false
        const tasks = this.props.projectInContext.tasks.map(task => {
            this.props.task.dependencies.predecessor.forEach(element => {
                if (element.taskId === task._id) {
                    flag = true
                }
            })
            if (flag) {
                return
            }
            if (this.props.task._id === task._id) {
                return
            }
            return (
                <a className="dropdown-item" value={task.name} onClick={() => { this.setDependancy(task) }}>{task.name}</a>
            )
        })
        return tasks
    }
    handelRemoveDependency = task => {
        const payload = {
            taskInContext: this.props.task,
            targetTask: task,
            project: this.props.projectInContext
        }
        this.props.removeDependency(payload)
    }
    renderRemoveDepenedencyButton = (task) => {
        return (
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handelRemoveDependency(task) }}>
                <i className="material-icons ">highlight_off</i>
            </button>
        )
    }
    renderPredecessorList = () => {
        const predecessorList = this.props.task.dependencies.predecessor.map(task => {
            if (this.props.task.name === task.taskName) {
                return
            }
            return (
                <li>{task.taskName} {this.renderRemoveDepenedencyButton(task)}</li>
            )
        })
        return predecessorList
    }
    renderSuccessorList = () => {
        const successorList = this.props.task.dependencies.predecessorTo.map(task => {
            if (this.props.task.name === task.taskName) {
                return
            }
            return (
                <li>{task.taskName}</li>
            )
        })
        return successorList
    }
    renderDependencies = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h5>Dependencies</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label>Predecessor Tasks :</label>
                    </div>
                    <div className="col-3">
                        {this.renderPredecessorList()}
                    </div>
                    <div className="col-3"></div>
                    <div className="col-2"></div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label>Successor Tasks :</label>
                    </div>
                    <div className="col-2">
                        {this.renderSuccessorList()}
                    </div>
                </div>
            </div>
        )
    }
    renderTeamMembers = () => {
        const members = this.props.projectInContext.members.map(member => {
            if (this.searchForAssignement(member)) {
                return (
                    <a class="dropdown-item" onClick={() => { this.handleAssign(member) }}>{member.name}</a>
                )
            }
        })
        return members
    }
    searchForAssignement = (member) => {
        const assigndeMembers = this.props.task.assignedMembers
        if (assigndeMembers.find(aMember => { return aMember.email === member.email })) { return false }
        else { return true }
    }
    renderAssignButton = () => {
        if (checkAuthority(this.props.projectInContext, "ASSIGN_TASK", this.props.userInfo)) {
            return (
                <div class="dropdown">
                    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        Assign member
                    </button>
                    <div class="dropdown-menu">
                        {this.renderTeamMembers()}
                    </div>
                </div>
            )
        }
    }
    handleAssign = (member) => {

        var startDate = new Date() //Retrieves the current date like this Mon Mar 11 2019 17:39:55 GMT+0300 (Arabian Standard Time)

        const payload = {
            member: member,
            task: this.props.task,
            project: this.props.projectInContext,
            startDate: startDate,   //Assignment date
            assigner: this.props.userInfo.email
        }
        this.props.assignTask(payload)
    }
    renderUnAssignButton = (member) => {
        if (checkAuthority(this.props.projectInContext, "UNASSIGN_TASK", this.props.userInfo)) {
            return (
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleUnassign(member) }}>
                    <i className="material-icons ">highlight_off</i>
                </button>
            )
        }
    }
    handleUnassign = (member) => {
        const payload = {
            member: member,
            task: this.props.task,
            project: this.props.projectInContext
        }
        this.props.unAssignTask(payload)
    }
    renderAssignedMembers = () => {
        const assignedMembers = this.props.task.assignedMembers.map(member => {
            return (
                <div className="col">
                    <p className="inline" on>{member.name}</p>
                    {this.renderUnAssignButton(member)}
                </div>
            )
        })
        return assignedMembers
    }

    handleActivityChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    renderActivities = () => {
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
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h5>Task Activities</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <ol className="">
                            {activites}
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
        )
    }
    handleNewActivity = () => {
        const activity = {
            name: this.state.activity,
            status: "UNCHECKED",
            date: new Date()
        }
        const payload = {
            activity: activity,
            task: this.props.task,
            project: this.props.projectInContext
        }
        if(this.state.activity.length >60){
            alert("activity name can't be more than 60 characters")
            return
        }
        this.props.newActivity(payload)
    }
    handleCriteriaChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    addNewCriteria = (e) => {
        const newCriteria = [...this.props.task.submissionCriteria, this.state.submissionCriteria]
        const payload = {
            newCriteria,
            task: this.props.task,
            project: this.props.projectInContext
        }
        this.props.newCriteria(payload)
    }
    renderTaskSubmissionCriteria = () => {
        
        return (
            this.props.task.submissionCriteria.map(criterion => {
                return(
                <li>
                    {criterion}
                </li>
                )    
            })
        )
    }
    render() {
        let text = makeid()
        return (
            <div className="editTask">
                <div className="tooltips">
                    <button title="Edit task" className="close" aria-label="Close" data-toggle="modal" data-target={"#" + text}>
                        <i class="material-icons">edit</i>
                    </button>
                    <span className="tooltiptext">Edit Task</span>
                </div>
                <div class="modal fade" id={text} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
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
                                        <input placeholder="Duration in days" id="duration" onChange={this.handleChange} />
                                    </div>
                                </div>
                             
                                <div className="row">
                                    <div className="col align-self-end">
                                        <button className="btn btn-primary btn-sm" onClick={this.handleEdit}>edit task</button>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-12">
                                        <label htmlFor="submissionCriteria">Output Acceptence Criteria</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <ul>
                                            {this.renderTaskSubmissionCriteria()}
                                        </ul>
                                        <div className="row">
                                            <div className="col">
                                                <input onChange={this.handleChange} id="submissionCriteria" type="text" placeholder="Criteria" />
                                            </div>
                                            <div className="col">
                                                <button className="btn btn-primary btn-sm" onClick={this.addNewCriteria}>Add Criteria</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Assign members</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    {this.renderAssignButton()}
                                    {this.renderAssignedMembers()}
                                </div>
                                <hr />

                                {this.renderDependencies()}


                                <div className="row">
                                    <div className="col-12">
                                        <div class="dropdown">
                                            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                Tasks
                                        </button>
                                            <div className="dropdown-menu">
                                                {this.renderTaskDropdown()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                {this.renderActivities()}
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
        setDependancy: (payload) => { dispatch(setDependancy(payload)) },
        editTask: (payload) => { dispatch(editTask(payload)) },
        assignTask: (payload) => { dispatch(assignTask(payload)) },
        setDependancy: (payload) => { dispatch(setDependancy(payload)) },
        editTask: (payload) => { dispatch(editTask(payload)) },
        newActivity: (payload) => { dispatch(newActivity(payload)) },
        unAssignTask: (payload) => { dispatch(unAssignTask(payload)) },
        removeDependency: payload => { dispatch(removeDependency(payload)) },
        newCriteria: payload => { dispatch(newCriteria(payload)) }
    }
}

const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext,
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyTask)