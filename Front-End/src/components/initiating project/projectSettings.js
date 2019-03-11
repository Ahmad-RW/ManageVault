import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import InviteMembers from './inviteMembers'
import { leaveProject, requestToDeleteProject, removeTeamMember, requestDeleteAction, assignNewTeamLeader } from '../../store/actionCreators/projectActions'
import inviteMembers from './inviteMembers';
import { checkAuthority } from '../../helper'
import MemberAnalysis from './MemberAnalysis'

class ProjectSettings extends Component {
    constructor(props) {
        super(props)
        console.log(this.state, "CONSTURCTOR")
    }

    state = {
        project: this.props.location.state.project,
        teamLeader: "",
        members: {},
        requestDeleteButton: false,
        renderMessageFlag: false,
        invitedMembers: "",
        renderMembers: false
    }


    renderMessage = () => {
        if (this.state.renderMessageFlag && document.getElementById('deletebtn') !== null) {
            document.getElementById('deletebtn').className = "d-none";
            return (
                <div className="container">
                    <div className="alert alert-danger">
                        <p>Delete request has been sent to team members</p>
                    </div>
                </div>
            )
        }
    }
    setRenderFlag = () => {
        this.setState({
            ...this.state,
            renderMessageFlag: true
        })
    }
    handleLeave = () => {
        console.log(this.state)
        this.props.leaveProject(this.state.project, this.props.userInfo)
        this.props.history.push('/home')
    }

    handleTeamLeaderStepDown = (e) => {
        this.props.assignNewTeamLeader(e.target.id, this.state.project)
        this.props.history.goBack()
    }
    setRenderMembers = () => {
        this.setState({
            ...this.state,
            renderMembers: true
        })
    }
    renderMembers = () => {
        if (this.state.renderMembers) {
            const project = this.state.project
            const membersList = project.members.map((member) => {
                if (!member.teamLeader) {
                    return (
                        <li>
                            <button onClick={(e) => { this.handleTeamLeaderStepDown(e) }} className="btn btn-secondary" key={member.email} id={member.email}>{member.name}</button>
                        </li>
                    )
                }
            })
            console.log(membersList)
            return (
                <div>
                    <h5>Select A New Leader</h5>
                    {membersList}
                </div>
            )
        }    
    }
    renderManageRolesButton = () =>{
        const currentMember = this.state.project.members.find(member =>{
            return member.email === this.props.userInfo.email
        })
        const project = this.props.location.state.project
        if(currentMember.teamLeader){
            return <Link to={{ pathname: "/grantAuthority", state: { project} }}>  <button className="btn btn-primary">Manage Roles</button></Link>
        }
        return;
    }
    renderLeaveButton = () => {
        if (this.state.project.members.length === 1) {
            return
        }
        const currentMember = this.state.project.members.find(member => {
            return member.email === this.props.userInfo.email
        })
        if (currentMember.teamLeader) {
            return (
                <button className="btn btn-secondary" onClick={this.setRenderMembers}>Step Down as Team Leader</button>
            )
        }
        else {
            return (
                <button className="btn btn-secondary" onClick={this.handleLeave}>Leave Project</button>
            )
        }
    }
    handleDelete = () => {
        console.log(this.state)
        if (this.state.project.members.length === 1) {
            this.props.requestDelete(this.state.project)
            this.props.history.push('/home')
            return
        }
        this.props.deleteProject(this.state.project, this.props.userInfo);
        this.setRenderFlag()
    }

    handleRemove = (member) => {
        this.props.removeTeamMember(this.state.project, member)
        this.props.history.push('/home')
        alert("Team member has been removed")
    }
    render() {
        const project = this.state.project
        const teamLeader = project.members.find(member => {
            return member.teamLeader
        })
        let flag = false;
        if (teamLeader.email === this.props.userInfo.email && project.status !== "PENDING") {
            flag = true;
        }

        let deleteButton = <span></span>
        if (flag && this.state.project.status !== 'PENDING') {
            deleteButton = <button className="btn btn-danger" id="deletebtn" onClick={this.handleDelete}>Delete Project</button> //Request to delete
        }

        let removeButton = <span></span>
        let grantAuthority = <span></span>
        let InvitedMembers = <span></span>
        let defineRoles = <span></span>
        const members = project.members.length ? (
            project.members.map(member => {
                if (teamLeader.email === this.props.userInfo.email) {
                    removeButton = <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemove(member) }}>
                        <i className="material-icons ">highlight_off</i>
                    </button>
                    InvitedMembers = <InviteMembers project={this.state.project} />
                    defineRoles = <Link to={{ pathname: "/newRole", state: { project } }} className="btn btn-info" role="button"> Define New Role </Link>
                }
                if (checkAuthority(this.state.project, "REMOVE_TEAM_MEMBERS", this.props.userInfo)) {
                    removeButton = <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemove(member) }}>
                        <i className="material-icons ">highlight_off</i>
                    </button>


                }
                if (checkAuthority(this.state.project, "INVITE_USERS", this.props.userInfo)) {
                    InvitedMembers = <InviteMembers project={this.state.project} />
                }
                if (!member.teamLeader) return (
                    <div>
                        <li className="list-group-item" key={member.email}>{member.name} {removeButton} {grantAuthority} </li>  
                        <MemberAnalysis member={member}/>
                    </div>
                )//jhvkbgfjbhvjgebv
            })
        ) : (<li class="list-group-item">project has no members</li>)
        return (
            <div className="container-fluid">
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-1">{project.title}</h1>
                        {this.renderMessage()}
                        <div className="row">
                            <h4>Team leader  : </h4>
                        </div>
                        <div className="row">
                            <ul class="list-group">
                                <li class="list-group-item list-group-item-primary">{teamLeader.name}</li>
                                <MemberAnalysis member={teamLeader}/>
                            </ul>
                        </div>
                        <hr />
                        <div className="row">
                            <h4>Team members :</h4>
                        </div>
                        <div className="row">
                            <ul class="list-group">
                                {members} 
                            </ul>

                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-3">
                                {this.renderManageRolesButton()}
                            </div>
                            <div className="col-3">
                                {this.renderLeaveButton()}
                            </div>
                            <div className="col-3">
                                {deleteButton}
                            </div>
                            <div className="col-3">
                                {defineRoles}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-4">
                                <ol>
                                    {this.renderMembers()}
                                </ol>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <form>
                            {InvitedMembers}
                        </form>
                    </div>
                </div>

            </div>


        )
    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.projects,
        userInfo: state.userInfo,
        auth: state.isAuthenticated
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        leaveProject: (project, userInfo) => dispatch(leaveProject(project, userInfo)),
        deleteProject: (project, userInfo) => dispatch(requestToDeleteProject(project, userInfo)),
        removeTeamMember: (project, member) => dispatch(removeTeamMember(project, member)),
        requestDelete: (project) => { dispatch(requestDeleteAction(project)) },
        assignNewTeamLeader: (memberEmail, project) => { dispatch(assignNewTeamLeader(memberEmail, project)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings)

