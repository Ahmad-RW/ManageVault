import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {setProject} from '../../store/actionCreators/projectActions'


class ProjectCard extends Component {


    isTeamLeader = (project) => {
        let result = false
        project.members.forEach(member => {
            console.log(member, "EACH MEMBER")
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
    render() {
        const projects = this.props.projects
        const projectsList = projects.length ? (
            projects.map((project) => {
                if(project.status === "STOPPED"){
                    return
                }
                return (
                    <div className="card bg-light col-sm-3" key={project._id} >
                        <div>
                            <ul className="nav nav-pills card-header-pills">
                                <li className="nav-item">
                                    <Link to={{ pathname: "/home/projectSettings", state: { project } }}>Manage Project</Link>
                                </li>
                                <li className="nav-item ml-2 ">
                                    <span >{project.status}</span>
                                </li>
                                <li>
                                    {this.renderTeamLeaderStar(project)}
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
        userInfo: state.userInfo,
      
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
    setProject : (project) => dispatch(setProject(project))
}
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard)