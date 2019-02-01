import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectCard from './ProjectCard'
import CreateProjectCard from './createProjectCard'
class Home extends Component {
    state = {
        projects : this.props.projects
    }
    render() {
        return (
            <div className="container">
                <ProjectCard projects = {this.props.projects} />
                <div className="row">
                    <CreateProjectCard />
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
