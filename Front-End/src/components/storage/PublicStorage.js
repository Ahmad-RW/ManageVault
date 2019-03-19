import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios';

class PublicStorage extends Component {
    state = {
        major_courseFilter: "",
        projects: []
    }
    componentWillMount() {
        axios.get("http://localhost:3333/storage/getPublishedProjects").then((res) => {
            this.setState({
                projects: res.data
            })
            console.log(this.state)
        })
    }
    handleCriteriaChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })

    }
    renderProjects = () => {
        let projectsList = this.state.projects
        if(this.state.major_courseFilter !== ""){//to check if filtering is applied
            projectsList = this.state.projects.filter(project => { return (project.major_course === this.state.major_courseFilter) })
        }
        const projects = projectsList.map(project => {
            return (
                <div className="card bg-light col-sm-3" key={project._id} >
                    <div>
                    </div>
                    <div className="card-body">
                        <h4 className="card-title">{project.title}</h4>
                        <p className="card-text">
                            <ul>
                                <li>Creator : {project.creator}</li>
                                <li> Members: <ul>{project.members.map(elem => { return <li>{elem.name}</li> })}</ul></li>
                            </ul>
                        </p>
                        <Link to={{ pathname: "/publicStorage/viewProject", state: { project } }} className="card-link">View Storage</Link>
                    </div>
                </div>
            )
        })
        return projects
    }
    renderDropDown = () => {
        return (
            <div className="form-group">
                <select className="form-control" onChange={this.handleCriteriaChange} id="major_courseFilter">
                    <option value="">No Filter</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Architecture and Planning">Architecture and Planning</option>
                    <option value="Law and Order">Law and Order</option>
                    <option value="Science And Engineering">Science And Engineering</option>
                    <option value="Medical Science">Medical Science</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Agriculture Sciences">Agriculture Sciences</option>
                    <option value="Psycology">Psycology</option>
                </select>
            </div>
        )
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4 offset-md-8">
                        <span>Filter By major/course</span>
                        {this.renderDropDown()}
                    </div>
                </div>
                <div className="row">
                    {this.renderProjects()}
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        userProjects: state.projects
    }
}

export default connect(mapStateToProps)(PublicStorage)