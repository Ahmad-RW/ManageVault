import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setAuthority, revokeAuthorities } from '../../store/actionCreators/projectActions'
import {Link} from 'react-router-dom'
import UserDefinedRoles from './userDefinedRoles';


class GrantAuthorities extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            projectId: this.props.location.state.project._id,
        }
    }
    getCurrentProject = () => {
        let currentProject = {}
        this.props.projects.forEach(project => {
            if (this.state.projectId === project._id) {
                currentProject = { ...project }
            }
        })
        return currentProject
    }
    handleRoleSelect = (e, member) => {
        let currentProject = this.getCurrentProject()
        console.log(e.target.id)
        if (e.target.value === "Assign") {
            let newRoles = member.roles
            currentProject.definedRoles.forEach(element => {
                if (element._id === e.target.id) {
                    newRoles = [
                        ...newRoles,
                        element
                    ]
                }
            })
            console.log(newRoles)
            const payload = {
                project: this.props.location.state.project,
                member,
                newRoles
            }
            this.props.setAuthority(payload)
            //window.location.reload()
        }
        if (e.target.value === "Revoke") {
            console.log(e.target.id)
            let newRoles = member.roles.filter(role => { return (role._id !== e.target.id) })
            console.log(newRoles)
            const payload = {
                project: currentProject,
                member,
                newRoles
            }
            this.props.revokeAuthorities(payload)
        }


    }
    renderRoleNames = () => {
        let currentProject = this.getCurrentProject()
        const roleNames = currentProject.definedRoles.map(role => {
            return (
                <th scope="col">{role.name}</th>
            )
        })
        return roleNames
    }
    handleRevoke = () => {
        let currentProject = this.getCurrentProject()
        const payload = {
            project: currentProject,
            member: this.state.member
        }
        this.props.revokeAuthority(payload)
    }
    checkRoles = (member, role) => {
        let result = false
        member.roles.forEach(element => {
            if (role._id === element._id) {
                result = true
            }
        })
        return result
    }
    renderTableButtons = (member) => {
        let currentProject = this.getCurrentProject()

        const rolesCheckBox = currentProject.definedRoles.map(role => {
            if (this.checkRoles(member, role)) {
                return (

                    <td><button onClick={(e) => { this.handleRoleSelect(e, member) }} id={role._id} value="Revoke" className="btn btn-danger btn-sm">Revoke Role</button></td>
                )
            }
            else {
                return (
                    <td><button onClick={(e) => { this.handleRoleSelect(e, member) }} id={role._id} value="Assign" className="btn btn-primary btn-sm">Assign Role</button></td>
                )
            }

        })
        return rolesCheckBox
    }
    renderTeamMembers = () => {
        let currentProject = this.getCurrentProject()
        const memberList = currentProject.members.map(member => {
            if(!member.teamLeader){
            return (
                <tr>
                    <th scope="row">
                        {member.name}
                    </th>
                    {this.renderTableButtons(member)}
                </tr>
            )
            }
        })
        return memberList

    }
    render() {
        let project = this.getCurrentProject()
        return (
            <div>
                <div className="container-fluid">
                    <div className="jumbotron jumbotron-fluid">
                        <div className="container">
                            <h1 className="display-1">{project.title}</h1>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4"><h3>Grant or Revoke Roles</h3></div>
                    <div className="col-2">
                       
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Members/Roles</th>
                                    {this.renderRoleNames()}
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTeamMembers()}

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <Link to={{ pathname: "/newRole", state: { project } }}><button type="submit" className="btn btn-info" >Define New Role</button></Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <hr />
                      
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        projects: state.projects,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setAuthority: (payload) => dispatch(setAuthority(payload)),
        revokeAuthorities: (payload) => dispatch(revokeAuthorities(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GrantAuthorities)