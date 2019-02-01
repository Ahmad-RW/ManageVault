import React, { Component } from 'react'
import { connect } from 'react-redux'
import { leaveProject } from '../../store/actionCreators/projectActions'
import { removeTeamMember } from '../../store/actionCreators/projectActions'
import { isNullOrUndefined } from 'util';
class ProjectSettings extends Component {
    constructor(props) {
        super(props)
        console.log(props)
    }
    state = {
        project: this.props.location.state.project,
        teamLeader: "",
        members: {},
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

    handleRemove = (member) => {
        // console.log(member.email,"TM email")
        this.props.removeTeamMember(this.state.project, member)
        this.props.history.push('/home')
        alert("Team member has been removed")
    }
    render() {
        const project = this.state.project
        const teamLeader = project.members.find(member => {
         return member.teamLeader
        })

        let deleteButton = <span></span>
        console.log(this.state)
        

        const members = project.members.length ? (
            project.members.map(member => {
                if(teamLeader.email === this.props.userInfo.email){
                    deleteButton = <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => {this.handleRemove(member)}}>
                        <i className="material-icons ">highlight_off</i>
                        </button>
                }
                if (!member.teamLeader) return (<li class="list-group-item" key={member.email}>{member.email} {deleteButton}</li>)
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
const mapDispatchToProps = (dispatch, project, ) => {
    return {
        leaveProject: (project, userInfo) => dispatch(leaveProject(project, userInfo)),
        removeTeamMember: (project, member) => dispatch(removeTeamMember(project, member))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings)