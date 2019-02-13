import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setAuthority, revokeAuthorities } from '../../store/actionCreators/projectActions'
class GrantAuthorities extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            projectId: this.props.location.state.project._id,
            member: this.props.location.state.member, //the member in context
            teamManager: false,// holds the information if the team manager selected or not.
            taskManager: false
        }
    }
    handleRoleSelect = (e) => {
        this.setState({
            [e.target.id]: e.target.checked,
        })
        console.log(this.state)

    }
    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.teamManager || this.state.taskManager) {
            const project = this.props.projects.find(project => project._id === this.state.projectId)
            let role;
            if (this.state.teamManager) {
                 role = {
                    name : "TEAM MANAGER",
                    authorities :  ["INVITE_USERS", "REMOVE_TEAM_MEMBERS", "PUBLISH_PROJECT", "UNPUBLISH_PROJECT"] 
                }
            }
            if(this.state.taskManager){
                role = {
                    name : "TASK MANAGER",
                    authorities :  [ "CREATE_TASK", "CONFIRM_SUBMISSION", "DELETE_TASK",
                    "ASSIGN_TASK", "UN-ASSIGN_TASK", "MODIFY_TASK"] 
                }
            }
            if(this.state.taskManager && this.state.teamManager){
                role = {
                    name : "TEAM AND TASK MANAGER",
                    authorities : [ "CREATE_TASK", "CONFIRM_SUBMISSION", "DELETE_TASK",
                    "ASSIGN_TASK", "UN-ASSIGN_TASK", "MODIFY_TASK", "INVITE_USERS", "REMOVE_TEAM_MEMBERS", "PUBLISH_PROJECT", "UNPUBLISH_PROJECT" ]
                }
            }
            const payload = {
                project,
                member: this.state.member,
                teamManager: this.state.teamManager,
                taskManager: this.state.taskManager,
                role : role
            }
            this.props.setAuthority(payload)
            this.props.history.goBack()
        }
    }

    handleRevoke = () =>{
        const payload = {
            project : this.props.location.state.project,
            member : this.state.member
        }
        this.props.revokeAuthority(payload)
    }
    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="jumbotron jumbotron-fluid">
                        <div className="container">
                            <h1 className="display-1">{this.state.projectId}</h1>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">{this.state.member.email}</div>
                    <div className="col-2">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" onClick={(e) => this.handleRoleSelect(e)} value="TEAM_MANAGER" id="teamManager" />
                            <label class="form-check-label" for="defaultCheck1"> Team Manager </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" onClick={(e) => this.handleRoleSelect(e)} value="TASK_MANAGER" id="taskManager" />
                            <label class="form-check-label" for="defaultCheck1"> Task Manager </label>
                        </div>
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
                <div className="row">
                    <div className="col-lg-4">
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
        revokeAuthority : (payload) => dispatch(revokeAuthorities(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GrantAuthorities)