import React, { Component } from 'react'
import { connect } from 'react-redux'
class UserDefinedRoles extends Component {

    constructor(props) {
        super(props)
        this.state = {
            roleName: "",
            authorities: []
        }
    }
    handleRoleName = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        console.log(this.state)

    }
    handleRoleSelect = (e) => {
        this.setState({
            authorities: [
                ...this.state.authorities, e.target.value]
        })
        console.log(this.state)
    }
    handleSubmit = (e) => {
        e.preventDefault()
        console.log(e)
        const role = {
            name: this.state.roleName,
            authorities: this.state.authorities

        }
        const payload = {
            project: this.props.project,
            member: this.props.member,
            role,
            userDefined: true,
        }
        this.props.setAuthority(payload)
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        <hr />
                        <h6>Or define your own roles</h6>
                        <input type="text" id="roleName" onChange={this.handleRoleName} />
                    </div>
                    <div className="col-sm-2">
                        <ul class="checkbox-grid">
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text1" value="INVITE_USERS" /><label for="text1">Invite Users</label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text2" value="REMOVE_TEAM_MEMBERS" /><label for="text2">Remove Team Members</label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text3" value="PUBLISH_PROJECT" /><label for="text3">Publish Project</label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text4" value="UNPUBLISH_PROJECT" /><label for="text4">Unpublish Project </label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text5" value="CREATE_TASK" /><label for="text5">Create Tasks</label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text6" value="CONFIRM_SUBMISSION" /><label for="text6">Confirm Submission</label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text7" value="DELETE_TASK" /><label for="text7">Delete Tasks</label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text8" value="ASSIGN_TASK" /><label for="text8">Assign Tasks</label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text8" value="UNASSIGN_TASK" /><label for="text8">Unassign Tasks</label></li>
                            <li><input onClick={this.handleRoleSelect} id="" type="checkbox" name="text8" value="MODIFY_TASK" /><label for="text8">Modify Tasks</label></li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <button className="btn btn-primary" onClick={this.handleSubmit}>Submit Role</button>
                    </div>
                </div>
            </div>


        )
    }
}



export default UserDefinedRoles