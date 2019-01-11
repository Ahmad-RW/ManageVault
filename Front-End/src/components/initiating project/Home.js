import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectCard from './ProjectCard'
import CreateProjectCard from './createProjectCard'
class Home extends Component {
    state = {
        projects: []
    }


    render() {
        return (

            <div className="container">
                <div className="row">
                    <ProjectCard />
                    <ProjectCard />
                    <ProjectCard />
                </div>
                <div className="row">
                <CreateProjectCard />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        authenticated: state.isAuthenticated
    }
}

export default connect(mapStateToProps)(Home)
