import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import RequestDelete from './requestDelete';

const ProjectCard = (props) => {
    const projects = props.projects
    const projectsList = projects.length ? (
        projects.map((project) => {
            return (
                <div className="card bg-light col-sm w-25 m-auto" key={project._id} >
                    <div>
                        <ul className="nav nav-pills card-header-pills">
                            <li className="nav-item">
                                <Link to={{ pathname:"/projectSettings", state:{project}}}  >Settings</Link>
                            </li>
                            <li className="nav-item ml-2 ">
                                <span >{project.status}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        <h4 className="card-title">{project.title}</h4>
                        <p className="card-text"> velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <Link to="#" className="card-link">Open Project</Link>
                        <RequestDelete project={project}/>
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

export default ProjectCard