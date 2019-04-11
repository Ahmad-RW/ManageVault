import React, { Component } from 'react';
import { connect } from 'react-redux'
import { createProjectAction, findUsers } from '../../store/actionCreators/projectActions'
import Navbar from '../layout/Navbar'

class CreateProject extends Component {
    constructor(props) {
        super(props)
        console.log(props.userInfo, "create project cons")
    }
    state = {
        majorIsNone: false,
        projectTitle: "",
        major_course: "",
        invitedMembers: "",
        showWarningMessage: false,
        redirect: false,
      
    }

    handleChange = (e) => {
        this.handleNoneSelection(e)
        this.setState({
            [e.target.id]: e.target.value
        })
        console.log(e.target.value)
    }

    handleNoneSelection = (e) => {
        if (e.target.value === "None") {
            this.setState({
                majorIsNone: true
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        console.log("in submit")
        if (this.state.projectTitle === "") {
            this.setState({
                showWarningMessage: true
            })
            return
        }
        if(this.state.projectTitle.length >60){
            alert("project name has to be less than 60 characters")
            return
        }
        else {
            let project = {
                creator: this.props.userInfo.name,
                title: this.state.projectTitle,
                major_course: this.state.major_course,
                invitedMembers: this.state.invitedMembers,
                members: [{
                    email: this.props.userInfo.email,
                    name : this.props.userInfo.name,
                    teamLeader: true
                }]
            }

            this.props.createProject(project, this.props.userInfo)
          
            this.props.history.push('/home')
        }
    }
    //  renderUsers = () => {
    //      console.log(this.props.users)
    //      // if(this.props.users.email === undefined){return}
    //      const users = this.props.users.map(user => {//stuck here
    //          return (
    //              <div>
    //              <li role="presentation"><a onClick={(e) => {this.handleSelectingUser(e)}}role="menuitem" tabindex="-1" href="#">{user.email}</a></li>
    //              <div class="dropdown-divider"></div>
    //              </div>
    //      )}
    //      )
    //      return users
    //  }
    handleSelectingUser = (e) => {
        console.log(e)
    }
    render() {
        let textField;
        if (this.state.majorIsNone) {
            textField = <input type="text" className="form-control form-control-sm" placeholder="Didn't found it? Write it here" onChange={this.handleChange} id="major_course" />
        }
        if (this.state.showWarningMessage) {
            this.warningMessage = <div className="alert alert-danger" role="alert">You are Required to Enter a Project Title </div>
        }
        return (
            <div>
            <Navbar />
            <div className="container">
                <form className="dropdown" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Project Title</label>
                        {this.warningMessage}
                        <input type="text" className="form-control" placeholder="e.g. graduation project" onChange={this.handleChange} id="projectTitle" />
                    </div>
                    <div className="form-group">
                        <label>Major/Course</label>
                        <select className="form-control" onChange={this.handleChange} id="major_course">
                            <option value="">Not Specefied</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Architecture and Planning">Architecture and Planning</option>
                            <option value="Law and Order">Law and Order</option>
                            <option value="Science And Engineering">Science And Engineering</option>
                            <option value="Medical Science">Medical Science</option>
                            <option value="Business Administration">Business Administration</option>
                            <option value="Agriculture Sciences">Agriculture Sciences</option>
                            <option value="Psycology">Psycology</option>
                            <option value="None">None</option>
                        </select>
                        {textField}
                    </div>
                    <div>
                        <div className="form-group">
                            <label>Invite Members</label>
                            <input type="text" className="form-control" onChange={this.handleChange} id="invitedMembers" />
                            {/* <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                            {this.renderUsers()}
                            </ul> */}
                            <small className='form-text text-muted'>Enter each email seperated by commas</small>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary " >Create Project</button>
                </form>
            </div>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch) => {
    return {
        createProject: (project, userInfo) => dispatch(createProjectAction(project, userInfo)),
        findUsers: (searchQuery) => dispatch(findUsers(searchQuery))
    }
}
const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo,
        users : state.users
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateProject)