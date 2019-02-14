import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectSubBar from '../layout/projectSubBar'
import Board from './Board'

class Workspace extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.location.state.project)
    }

    state = {
        userInfo: this.props.userInfo,
        project: this.props.project
    }

    render() {
        return (
                <div>
                    <ProjectSubBar />
                    <h1>this is the workspace of {this.state.project.title}</h1>
                    
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.isAuthenticated,
        userInfo: state.userInfo,
        project : state.projectInContext

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Workspace)