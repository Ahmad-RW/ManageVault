import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {setProject} from '../../store/actionCreators/projectActions'
class ProjectSubBar extends Component{
    constructor(props) {
        super(props)
    }
    
    
    render() {
        const project = this.props.project
        return (
            <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to="#">{project.title}</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-item nav-link" to={{ pathname: "/board", state: { project} }}>Board</Link>
                        <Link className="nav-item nav-link" to='#'>Storage</Link>
                    </div>
                </div>
            </nav>
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

const mapDispatchToProps = (dispatch) =>{
    return{
    setProject : (project) => dispatch(setProject(project))
}
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSubBar);
