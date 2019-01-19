import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
const ProjectCard = (props) => {
    const projects = props.projects
    const projectsList = projects.length ? (
        projects.map((project) => {
            return (
                <div className="card col-sm w-25 m-auto" key={project.id} >
                    <div className="card-body">
                        <h5 className="card-title">{project.title}</h5>
                        <p className="card-text">{project.discription}</p>
                        <Link to="#" className="card-link">Open Project</Link>
                    </div>
                </div>
            )
        })) : (<div className="col-sm">You Have No Running Projects</div>)

    return (
        <div className="row">
        { projectsList }
        </div>
        )
}

export default ProjectCard