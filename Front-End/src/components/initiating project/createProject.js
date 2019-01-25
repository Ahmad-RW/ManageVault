import React, { Component } from 'react';
import { connect } from 'react-redux'
import { createProjectAction } from '../../store/actionCreators/projectActions'
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
        showWarningMessage: false
    }

    handleChange = (e) => {
        this.handleNoneSelection(e)
        this.setState({
            [e.target.id]: e.target.value
        })
        
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
        else {
            let project = {
                creator : this.props.userInfo.name,
                title: this.state.projectTitle,
                major_course: this.state.major_course,
                invitedMembers: this.state.invitedMembers,
                members : [{
                    email: this.props.userInfo.email,
                    teamLeader : true
                }]
            }
            this.props.createProject(project)
           this.props.history.push('/home')
        }
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
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Project Title</label>
                        {this.warningMessage}
                        <input type="text" className="form-control" placeholder="e.g. graduation project" onChange={this.handleChange} id="projectTitle" />
                    </div>
                    <div className="form-group">
                        <label>Major/Course</label>
                        <select className="form-control" onChange={this.handleChange} id="major_course">
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
                            <small className='form-text text-muted'>Enter each name seperated by commas</small>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary " >Create Project</button>
                </form>
            </div>
        )
    }
 
}
const mapDispatchToProps = (dispatch) => {
    return {
        createProject: (project) => dispatch(createProjectAction(project))
    }
}
const mapStateToProps = (state) =>{
    return {
        userInfo : state.userInfo
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateProject)