import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {setProject} from '../../store/actionCreators/projectActions'

class ProjectSubBar extends Component{
    constructor(props) {
        super(props)
        this.state = {
            sidebarOpen: false
        }
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
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
                <input type="checkbox" class="openSidebarMenu toggleCheckBox" id="openSidebarMenu" />
                <label for="openSidebarMenu" class="sidebarIconToggle">
                    <div class="spinner diagonal part-1"></div>
                    <div class="spinner horizontal"></div>
                    <div class="spinner diagonal part-2"></div>
                </label>
                <div id="sidebarMenu">
                    <ul class="sidebarMenuInner">
                        <li><Link to="#"><h1>{project.title}</h1></Link></li>
                        <li><Link to={{ pathname: "/home/projectWorkSpace/board", state: { project} }}>Board</Link></li>
                        <li><Link to='/home/projectWorkSpace/storage'>Documents</Link></li>
                        <li><Link to='/home/projectWorkSpace/channel'>Chat channels</Link></li>
                        <li>Whiteboard</li>
                        <li>
                            <p>Project Progress</p>{this.renderProgressBar()}
                        </li>
                    </ul>
                </div>
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
