import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setAuthority, revokeAuthorities } from '../../store/actionCreators/projectActions'
import UserDefinedRoles from './userDefinedRoles';

class GrantAuthorities extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            projectId: this.props.location.state.project._id,
            member: this.props.location.state.member, //the member in context
            teamManager: false,// holds the information if the team manager selected or not.
            taskManager: false,
            rolesSelected: []
        }
    }
    handleRoleSelect = (e) => {
        const newRolesSelected = [...this.state.rolesSelected, e.target.id]
        this.setState({
            rolesSelected: newRolesSelected
        })
        console.log(this.state)

    }
    handleSubmit = (e) => {
        e.preventDefault()
        // if (this.state.teamManager || this.state.taskManager) {
        //     const project = this.props.projects.find(project => project._id === this.state.projectId)
        //     let role;
        //     if (this.state.teamManager) {
        //         role = {
        //             name: "TEAM MANAGER",
        //             authorities: ["INVITE_USERS", "REMOVE_TEAM_MEMBERS", "PUBLISH_PROJECT", "UNPUBLISH_PROJECT"]
        //         }
        //     }
        //     if (this.state.taskManager) {
        //         role = {
        //             name: "TASK MANAGER",
        //             authorities: ["CREATE_TASK", "CONFIRM_SUBMISSION", "DELETE_TASK",
        //                 "ASSIGN_TASK", "UN-ASSIGN_TASK", "MODIFY_TASK"]
        //         }
        //     }
        //     if (this.state.taskManager && this.state.teamManager) {
        //         role = {
        //             name: "TEAM AND TASK MANAGER",
        //             authorities: ["CREATE_TASK", "CONFIRM_SUBMISSION", "DELETE_TASK",
        //                 "ASSIGN_TASK", "UN-ASSIGN_TASK", "MODIFY_TASK", "INVITE_USERS", "REMOVE_TEAM_MEMBERS", "PUBLISH_PROJECT", "UNPUBLISH_PROJECT"]
        //         }
        //     }
        // const payload = {
        //     project,
        //     member: this.state.member,
        //     teamManager: this.state.teamManager,
        //     taskManager: this.state.taskManager,
        //     role: role
        // }
        let newRoles = this.state.member.roles
        console.log(newRoles)
        this.props.location.state.project.definedRoles.forEach(role => {
            if (this.state.rolesSelected.includes(role._id)) {
                newRoles = [
                    ...newRoles,
                    role
                ]
                if (this.state.rolesSelected.includes("teamManager")) {
                    const teamManager = {
                        name: "Team Manager",
                        authorities: ["INVITE_USERS", "REMOVE_TEAM_MEMBERS", "PUBLISH_PROJECT", "UNPUBLISH_PROJECT"]
                    }
                    newRoles = [
                        ...newRoles,
                        teamManager
                    ]
                }
                if (this.state.rolesSelected.includes("taskManager")) {
                    const taskManager = {
                        name: "Task Manager",
                        authorities: ["CREATE_TASK", "CONFIRM_SUBMISSION", "DELETE_TASK",
                            "ASSIGN_TASK", "UN-ASSIGN_TASK", "MODIFY_TASK"]
                    }
                    newRoles = [
                        ...newRoles,
                        taskManager
                    ]
                }
            }
        })
        const payload = {
            project: this.props.location.state.project,
            member: this.state.member,
            newRoles
        }
        console.log(payload)
        this.props.setAuthority(payload)
        this.props.history.goBack()
    }

    renderRoles = () => {
        const project = this.props.location.state.project
        const roles = project.definedRoles.map(role => {
            return (
                <div className="form-check">
                    <input class="form-check-input" onClick={(e) => this.handleRoleSelect(e)} type="checkbox" value="" id={role._id} />
                    <label class="form-check-label" for="defaultCheck1"> {role.name} </label>
                </div>
            )

        })
        return roles
    }
    handleRevoke = () => {
        const payload = {
            project: this.props.location.state.project,
            member: this.state.member
        }
        this.props.revokeAuthority(payload)
    }


    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="jumbotron jumbotron-fluid">
                        <div className="container">
                            <h1 className="display-1">{this.props.location.state.project.title}</h1>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4"><h3>{this.state.member.email}</h3></div>
                    <div className="col-2">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" onClick={(e) => this.handleRoleSelect(e)} value="TEAM_MANAGER" id="teamManager" />
                            <label class="form-check-label" for="defaultCheck1"> Team Manager </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" onClick={(e) => this.handleRoleSelect(e)} value="TASK_MANAGER" id="taskManager" />
                            <label class="form-check-label" for="defaultCheck1"> Task Manager </label>
                        </div>
                        {this.renderRoles()}
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
                    </div>
                </div>
                {/* <UserDefinedRoles member = {this.state.member} project = {this.props.location.state.project} setAuthority = {this.props.setAuthority} /> */}
                <div className="row">
                    <div className="col-lg-4">
                        <hr />
                        <button type="submit" className="btn btn-danger" onClick={this.handleRevoke}>Revoke Authorities</button>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        projects: state.projects
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setAuthority: (payload) => dispatch(setAuthority(payload)),
        revokeAuthority: (payload) => dispatch(revokeAuthorities(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GrantAuthorities)