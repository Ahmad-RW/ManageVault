import React from 'react'
import {Link} from 'react-router-dom'
const ProjectCard = () => {
    return (
        <div className="card col-sm w-25 m-auto ">
            <div className="card-body">
                <h5 className="card-title">Project Title</h5>
                <p className="card-text">Maybe we can put some project discription here</p>
                <Link to="#" className="card-link">Open Project</Link>
            </div>
        </div>
    )
}

export default ProjectCard