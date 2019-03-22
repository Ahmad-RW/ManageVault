import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectCard from './ProjectCard'
import CreateProjectCard from './createProjectCard'
import Navbar from '../layout/Navbar'
class Home extends Component {
    state = {
        projects : this.props.projects
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
