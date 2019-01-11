import React from 'react'
import {Link} from 'react-router-dom'
const createProjectCard = () =>{
    return (
        <div className="card w-25 m-auto ">
            <div className="card-body">
            <h5 className="card-title">Create a Project</h5>
            <Link to="#">  <span className="card-title material-icons md-48"> add </span></Link>
            <br />
            </div>
        </div>
            )
}

export default createProjectCard