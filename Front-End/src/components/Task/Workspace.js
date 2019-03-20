import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectSubBar from '../layout/projectSubBar'
import Board from './Board'
import Axios from 'axios';

class Workspace extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        userInfo: this.props.userInfo,
        project: this.props.project,
        auth : {},
        googleConsentURL: ""
    }
    componentWillMount(){
        Axios.post("http://localhost:3333/getGoogleURL").then((res)=>{
            console.log(res)
            this.setState({
                googleConsentURL : res.data
            })
        }).catch((err=>{
            console.log(err)
        }))

        
    }
    render() {
        return (
            <div>
                <ProjectSubBar />
                <a href={this.state.googleConsentURL}>hey</a>
                <h1>this is the workspace of {this.state.project.title}</h1>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.isAuthenticated,
        userInfo: state.userInfo,
        project: state.projectInContext

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace)