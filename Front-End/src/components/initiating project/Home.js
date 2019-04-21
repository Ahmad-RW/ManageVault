import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectCard from './ProjectCard'
import CreateProjectCard from './createProjectCard'
import Navbar from '../layout/Navbar'
class Home extends Component {
    state = {
        projects : this.props.projects
    }
    deadline = () => {
        var today = new Date()

        this.props.projects.map(project => {
            project.tasks.map(task => {
                var remainingTime = today - new Date(task.startDate)
                var hoursRemainig = (((remainingTime / 1000 ) / 60 ) / 60 )
                console.log(hoursRemainig,"hours remaining")
                if(hoursRemainig <= 24){
                    console.log("Deadline is close for task "+task.name)
                }
            })
        })
    }
    render() {
        return (
            <div>
            <Navbar />
            <div className="container">
                <ProjectCard />
                <div className="row">
                        <CreateProjectCard />
                </div>
            </div>
            {this.deadline()}
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        projects : state.projects,
        authenticated: state.isAuthenticated,
    }
}

export default connect(mapStateToProps)(Home)
