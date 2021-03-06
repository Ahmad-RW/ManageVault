import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {setProject} from '../../store/actionCreators/projectActions'
import { isUserTeamLeader } from "../../helper";
import { leaveProject } from '../../store/actionCreators/projectActions'

class ProjectCard extends Component {


    isTeamLeader = (project) => {
        let result = false
        project.members.forEach(member => {
        
            if (member.email === this.props.userInfo.email && member.teamLeader) {
                result = true
            }
        });
        return result
    }
    renderTeamLeaderStar = (project) => {
        let flag = this.isTeamLeader(project)
        if (flag) {
            return (<span data-toggle="tooltip" title="you are a leader in this project !"><i class="material-icons">supervised_user_circle</i></span>)
        }
    }
    setProjectCookie = (project ,projectId) =>  {
       // localStorage.setItem("currentProject", projectId)
        this.props.setProject(projectId)
    }
    renderManageProject = (userInfo, project) =>{
        if(isUserTeamLeader(userInfo, project )){
            return(
                <Link onClick= {() => this.setProjectCookie(project, project._id)} to={{ pathname: "/home/projectSettings", state: { project } }}>Manage Project</Link>
            )
        }
        return(
            <Link onClick= {() => this.setProjectCookie(project, project._id)} to={{ pathname: "/home/projectSettings", state: { project } }}>Project Information</Link>
        )
    }
    renderLeaveProject = (userInfo, project) =>{
        if(!isUserTeamLeader(userInfo, project)){
            return (
                <button className="btn btn-danger btn-sm" onClick={()=>{this.props.leaveProject(project, userInfo)}}>Leave Project</button>
            )
        }
    }
    handleLeave = () => {
        this.props.leaveProject(this.state.project, this.props.userInfo)
        this.props.history.push('/home')
    }
    render() {
        const projects = this.props.projects
        const projectsList = projects.length ? (
            projects.map((project) => {
                if(project.status === "STOPPED"){
                    return
                }
                return (
                    <div className="card bg-light col-sm-3 PCmargin" key={project._id} >
                        <div>
                            <ul className="nav nav-pills card-header-pills">
                                <li className="nav-item">
                                    {this.renderManageProject(this.props.userInfo, project)}
                                </li>
                                <li className="nav-item ml-2 ">
                                    <span >{project.status}</span>
                                </li>
                                <li>
                                    {this.renderTeamLeaderStar(project)}
                                </li>
                                <li>
                                    {this.renderLeaveProject(this.props.userInfo, project)}
                                </li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <h4 className="card-title">{project.title}</h4>
                            <p className="card-text"> velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                 
                            <Link onClick= {() => this.setProjectCookie(project, project._id)} to={{ pathname: "/home/projectWorkSpace", state: { project } }} className="card-link">Open Project</Link>

                        </div>
                    </div>
                )
            })) : (<div className="col-sm">You Have No Running Projects</div>)

        return (
            <div className="row">
                {projectsList}
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

const mapDispatchToProps = (dispatch) =>{
    return{
    setProject : (project) => dispatch(setProject(project)),
    leaveProject : (project, userInfo) => dispatch(leaveProject(project, userInfo))
}
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard)