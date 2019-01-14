import React, { Component } from 'react';
import {connect} from 'react-redux'
import {createProjectAction} from '../../store/actionCreators/projectActions'
class CreateProject extends Component {
    constructor(props){
        super(props)
    }
    state = {
        majorIsNone : false,
        projectTitle: "",
        major_course : "",
        invitedMembers : "",
        showWarningMessage : false
    }

    handleChange = (e) =>{
       this.setState({
           [e.target.id] : e.target.value
       })
      this.handleNoneSelection(e)
      console.log(this.state)
    }

    handleNoneSelection = (e) =>{
        if(e.target.value === "9"){
            this.setState({
                majorIsNone : true
            })
        }
    }
    handleSubmit = (e) =>{
        e.preventDefault()
        console.log("in submit")
        if(this.state.projectTitle === ""){
            this.setState({
                showWarningMessage : true
            })
            return
        }
        else{
            let project = {
                projectTitle : this.state.projectTitle,
                major_course : this.state.major_course,
                invitedMembers : this.state.invitedMembers

            }
            this.props.createProject(project)
        }
    }
    render() {
        let textField;
        if(this.state.majorIsNone){
           textField = <input type="text" className="form-control form-control-sm" placeholder="Didn't found it? Write it here" onChange={this.handleChange} id="major_course" /> 
        }
        if(this.state.showWarningMessage){
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
                            <option value = "1">Information Technology</option> 
                            <option value = "2">Architecture and Planning</option>
                            <option value = "3">Law and Order</option>
                            <option value = "4">Science And Engineering</option>
                            <option value = "5">Medical Science</option>
                            <option value = "6">Business Administration</option>
                            <option value = "7">Agriculture Sciences</option>
                            <option value = "8">Psycology</option>
                            <option value = "9">None</option>
                            <option></option>
                            <option></option>
                            <option></option>
                        </select>
                        {textField}
                    </div>
                    <div>
                        <div className="form-group">
                        <label>Invite Members</label>
                        <input type= "text" className="form-control" onChange={this.handleChange} id="invitedMembers" />
                        <small className='form-text text-muted'>Enter each name seperated by commas</small>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary " >Create Project</button>
                </form>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch) =>{
    return{
        createProject : (project)=> dispatch(createProjectAction(project))
    }
}
export default connect(null, mapDispatchToProps)(CreateProject)