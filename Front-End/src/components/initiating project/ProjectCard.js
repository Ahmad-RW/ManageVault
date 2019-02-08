import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'


class ProjectCard extends Component {

    render() {
        const projects = this.props.projects
        const projectsList = projects.length ? (
            projects.map((project) => {
                return (
                    <div className="card bg-light col-sm-3" key={project._id} >
                        <div>
                            <ul className="nav nav-pills card-header-pills">
                                <li className="nav-item">
                                    <Link to={{ pathname: "/projectSettings", state: { project } }}>Settings</Link>
                                </li>
                                <li className="nav-item ml-2 ">
                                    <span >{project.status}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <h4 className="card-title">{project.title}</h4>
                            <p className="card-text"> velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <Link to={{ pathname: "/projectWorkSpace", state: { project } }} className="card-link">Open Project</Link>

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

const mapStateToProps = (state) =>{
    return {
        projects : state.projects
    }
}
export default connect(mapStateToProps)(ProjectCard)