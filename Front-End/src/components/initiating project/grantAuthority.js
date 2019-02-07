import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setAuthority } from '../../store/actionCreators/projectActions'
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
            let newAuthorities = this.state.member.authorities.slice()
            console.log(project.roles.TaskManager)
            if (this.state.teamManager) {
                newAuthorities = [...newAuthorities, project.roles.TeamManager]
            }
            if (this.state.taskManager) {
                newAuthorities = [...newAuthorities, project.roles.TaskManager]
            }
            console.log(newAuthorities, "New Authoritiees")
            const payload = {
                project,
                member: this.state.member,
                teamManager: this.state.teamManager,
                taskManager: this.state.taskManager,
                newAuthorities
            }
            this.props.setAuthority(payload)
            this.props.history.goBack()
        }
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
                    <div className="col-lg-6">
                        <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
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
        setAuthority: (payload) => dispatch(setAuthority(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GrantAuthorities)