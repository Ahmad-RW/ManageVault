import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import { leaveProject, requestToDeleteProject, removeTeamMember, requestDeleteAction } from '../../store/actionCreators/projectActions'
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
        renderMessageFlag: false
    }


    renderMessage = () => {
        console.log(document.getElementById('deletebtn'))
        if (this.state.renderMessageFlag && document.getElementById('deletebtn')!==null ) {
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
        // console.log(member.email,"TM email")
        this.props.removeTeamMember(this.state.project, member)
        this.props.history.push('/home')
        alert("Team member has been removed")
    }
    checkAuthority =(member)=>{
        console.log(member)
        const authorities = member.authorities
        let result = false
        authorities.forEach(element => {
            console.log(element.includes("REMOVE_TEAM_MEMBERS"))
            if(element.includes("REMOVE_TEAM_MEMBERS")){
                result = true
            }
        });
        return result
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
        const members = project.members.length ? (
            project.members.map(member => {
               const isAuthorized = this.checkAuthority(member)
                console.log(isAuthorized)
                if (teamLeader.email === this.props.userInfo.email ) {
                    removeButton = <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemove(member) }}>
                        <i className="material-icons ">highlight_off</i>
                    </button>
                    grantAuthority = <Link to={{ pathname:"/grantAuthority", state:{project, member}}}>Grant Authority</Link>
                }
                if(isAuthorized){
                    removeButton = <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.handleRemove(member) }}>
                        <i className="material-icons ">highlight_off</i>
                    </button>

                }
                if (!member.teamLeader) return (<li class="list-group-item" key={member.email}>{member.email} {removeButton} {grantAuthority} </li>)
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
                                <li class="list-group-item list-group-item-primary">{teamLeader.email}</li>
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
                            <div className="col-4">
                                <button className="btn btn-secondary" onClick={this.handleLeave}>Leave Project</button>
                            </div>
                            <div className="col-4">
                                {deleteButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.projects,
        userInfo: state.userInfo
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        leaveProject: (project, userInfo) => dispatch(leaveProject(project, userInfo)),
        deleteProject: (project, userInfo) => dispatch(requestToDeleteProject(project, userInfo)),
        removeTeamMember: (project, member) => dispatch(removeTeamMember(project, member)),
        requestDelete: (project) => { dispatch(requestDeleteAction(project)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings)