import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {setProject} from '../../store/actionCreators/projectActions'
class ProjectSubBar extends Component{
    constructor(props) {
        super(props)
    }
    
    renderProgressBar = () => {
        let totalTasks = this.props.project.tasks.length
        let submittedTasks = 0
        for(let i=0; i<this.props.project.tasks.length; i++){
            if(this.props.project.tasks[i].status === "SUBMITTED"){
                submittedTasks++
            }
        }
        let percentage = submittedTasks / totalTasks * 100
        console.log(percentage, "Finished Tasks")
        if(totalTasks === 0){
            percentage = 0  
          }
        let widthValue = percentage
        return (
             <div className="progress">
                <div className="progress-bar progress-bar-striped bg-success" role="progressbar" aria-valuenow='50' aria-valuemin='0' aria-valuemax="100" style={{width: widthValue+'%'}}></div>
            </div>
        )
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
                        <Link className="nav-item nav-link" to={{ pathname: "/home/projectWorkSpace/board", state: { project} }}>Board</Link>
                        <Link className="nav-item nav-link" to='/home/projectWorkSpace/storage'>Storage</Link>
                    </div>
                </div>
                {this.renderProgressBar()}
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
