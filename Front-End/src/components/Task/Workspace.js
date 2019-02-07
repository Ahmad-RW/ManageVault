import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectSubBar from '../layout/projectSubBar'
import Board from './Board'

class Task extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.location.state.project)
    }

    state = {
        userInfo: this.props.userInfo,
        project: this.props.location.state.project
    }

    handleCreateTask = (e) => {
        e.preventDefault()
        console.log(e)
    }

    render() {
        return (
                <div>
                    <ProjectSubBar/>
                    <h1>this is the workspace of {this.state.project.title}</h1>
                    <Board project={this.state.project}/>
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.isAuthenticated,
        userInfo: state.userInfo,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Task)