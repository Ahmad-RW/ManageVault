import React, { Component } from 'react'
import { connect } from 'react-redux'
import { leaveProject } from '../../store/actionCreators/projectActions'
import { isNullOrUndefined } from 'util';
class ProjectSettings extends Component {
    state = {
        project: {},
        teamLeader: "",
        members: {}
    }

    constructor(props) {
        super(props)

    }

    componentWillMount() {
        console.log(this.props.location.state.project)
        // const project = this.props.projects.find(project => {
        //     return project._id === this.props.match.params._id
        // })
        // const teamLeader = project.members.find(member => {
        //     return member.teamLeader
        // })
        // const members = project.members.length ? (
        //     project.members.map(member => {
        //         if (!member.teamLeader) return (<li class="list-group-item">{member.email}</li>)
        //     })
        // ) : (<li class="list-group-item">project has no members</li>)
        // this.setState({
        //     project,
        //     teamLeader,
        //     members
        // })
        const project = this.props.location.state.project
           const teamLeader = project.members.find(member => {
            return member.teamLeader
        })
        const members = project.members.length ? (
            project.members.map(member => {
                if (!member.teamLeader) return (<li class="list-group-item">{member.email}</li>)
            })
        ) : (<li class="list-group-item">project has no members</li>)

           this.setState({
            project,
            teamLeader,
            members
        })

    }
    handleLeave = () => {
        console.log(this.state)
        this.props.leaveProject(this.state.project, this.props.userInfo)
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-1">{this.state.project.title}</h1>
                        <div className="row">
                            <h4>Team leader  : </h4>
                        </div>
                        <div className="row">
                            <ul class="list-group">
                                <li class="list-group-item list-group-item-primary">{this.state.teamLeader.email}</li>
                            </ul>
                        </div>
                        <hr />
                        <div className="row">
                            <h4>Team members :</h4>

                        </div>
                        <div className="row">
                            <ul class="list-group">
                                {this.state.members}
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
        leaveProject: (project, userInfo) => dispatch(leaveProject(project, userInfo))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings)