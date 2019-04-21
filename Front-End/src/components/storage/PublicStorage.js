import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Navbar from '../layout/Navbar'

class PublicStorage extends Component {
    state = {
        major_courseFilter: "",
        projects: [],
        viewRecent: false,
        alphabetically : false
    }
    componentWillMount() {
        axios.get("http://localhost:3333/storage/getPublishedProjects").then((res) => {
            this.setState({
                projects: res.data
            })
            
        })
    }
    handleCriteriaChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })

    }
    renderProjects = () => {
        
        let projectsList = this.state.projects
        if(this.state.viewRecent){
            projectsList.sort(this.projectsDateComparator)
        }
        if(this.state.alphabetically){
            projectsList.sort(this.projectsAlphabeticalComparator)
        }
        if (this.state.major_courseFilter !== "") {//to check if filtering is applied
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
    projectsAlphabeticalComparator =(p1,p2)=>{
        var name1 = p1.title.toUpperCase()
        var name2 = p2.title.toUpperCase()
        if (name1 < name2) {
    
            return -1
        }
        if (name1 > name2) {
           
            return 1
        }
        
        return 0
    }
    projectsDateComparator = (p1, p2) => {
        var d1 = new Date(p1.publishDate)
        var d2 = new Date(p2.publishDate)
        if (d1 > d2) {
          
            return -1
        }
        if (d1 < d2) {
           
            return 1
        }
        
        return 0
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
            <div>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-md-4 offset-md-8">
                        <span>Filter By major/course</span>
                        {this.renderDropDown()}
                    </div>
                    <div className="col-md-4 offset-md-8">
                        <form>
                        <input onClick={(e) => {
                            console.log(e.target.checked)
                            this.setState({ viewRecent: e.target.checked, alphabetically:false })
                            console.log(this.state)
                        }} type="radio" id="viewRecent" name="sorting" />
                        <lable for="viewRecent">View Most Recent Published Projects First</lable>
                        <br/>
                        <input onClick={(e) => {
                            console.log(e.target.checked)
                            this.setState({ alphabetically: e.target.checked, viewRecent:false })
                            console.log(this.state)
                        }} type="radio" id="alphabetically" name="sorting" />
                        <label for="alphabetically">View By Alphabetical Order</label>
                        </form>
                       
                       
                    </div>
                </div>
                <div className="row">
                    {this.renderProjects()}
                </div>
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