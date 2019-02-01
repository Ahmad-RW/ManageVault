import React, { Component } from 'react'
import { connect } from 'react-redux'
import { leaveProject, requestToDeleteProject, removeTeamMember } from '../../store/actionCreators/projectActions'

class ProjectSettings extends Component {
    constructor(props) {
        super(props)
    }
    
    state = {
        project: this.props.location.state.project,
        teamLeader: "",
        members: {},
        requestDeleteButton: false,
        renderMessageFlag: false 
    }


        renderMessage = () => {
            if(this.state.renderMessageFlag){
            document.getElementById('deletebtn').className = "d-none";
            return (
                <div className="container">
                    <div className = "alert alert-danger">
                        <p>Delete request has been sent to team members</p>
                    </div>
                </div>
            )
        }
    }
        setRenderFlag = () => {
            this.setState({
                ...this.state,
                renderMessageFlag: true
            })
        }
    componentWillMount() {
        const project = this.props.location.state.project
           const teamLeader = project.members.find(member => {
            return member.teamLeader
        })
                let flag = false;
                if(teamLeader.email === this.props.userInfo.email){
                    flag = true;
                }
           this.setState({
               ...this.state,
            requestDeleteButton: flag
        })


    }
    
    // componentWillUpdate() {
    //     console.log("i am in component Will Receive Props")
    //     this.forceUpdate()
    // }
    handleLeave = () => {
        console.log(this.state)
        this.props.leaveProject(this.state.project, this.props.userInfo)
        this.props.history.push('/home')
    }
    handleDelete = (e) => {
        console.log(this.state)
        this.props.deleteProject(this.state.project, this.props.userInfo);
        this.setRenderFlag()
    }

    handleRemove = (member) => {
        // console.log(member.email,"TM email")
        this.props.removeTeamMember(this.state.project, member)
        this.props.history.push('/home')
        alert("Team member has been removed")
    }
    render() {
        let deleteButton = <span></span>
        if(this.state.requestDeleteButton && this.state.project.status !== 'PENDING'){
            deleteButton = <button className="btn btn-danger" id="deletebtn" onClick={this.handleDelete}>Delete Project</button> //Request to delete
        }
        const project = this.state.project
        const teamLeader = project.members.find(member => {
         return member.teamLeader
        })

        let removeButton = <span></span>
        console.log(this.state)
        

        const members = project.members.length ? (
            project.members.map(member => {
                if(teamLeader.email === this.props.userInfo.email){
                    removeButton = <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => {this.handleRemove(member)}}>
                        <i className="material-icons ">highlight_off</i>
                        </button>
                }
                if (!member.teamLeader) return (<li class="list-group-item" key={member.email}>{member.email} {removeButton}</li>)
            })
        ) : (<li class="list-group-item">project has no members</li>)
        //    this.setState({
        //     project,
        //     teamLeader,
        //     members
        // })
        return (
            <div className="container-fluid">
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-1">{project.title}</h1>
                            {this.renderMessage()}
                        <div className="row">
                            <h4>Team leader  : </h4>
                        </div>
                        <div className="row">
                            <ul class="list-group">
                                <li class="list-group-item list-group-item-primary">{teamLeader.email}</li>
                            </ul>
                        </div>
                        <hr />
                        <div className="row">
                            <h4>Team members :</h4>

                        </div>
                        <div className="row">
                            <ul class="list-group">
                                {members}
                            </ul>

                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-4">
                                <button className="btn btn-secondary" onClick={this.handleLeave}>Leave Project</button>
                            </div>
                            <div className="col-4">
                                {deleteButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.projects,
        userInfo: state.userInfo
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        leaveProject: (project, userInfo) => dispatch(leaveProject(project, userInfo)),
        deleteProject : (project, userInfo)=> dispatch(requestToDeleteProject(project, userInfo)),
        removeTeamMember: (project, member) => dispatch(removeTeamMember(project, member))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings)