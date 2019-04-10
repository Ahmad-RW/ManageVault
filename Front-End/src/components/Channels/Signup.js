import React, {Component} from 'react';
import {connect}from 'react-redux'
import Navbar from '../layout/Navbar';
import ProjectSubBar from '../layout/projectSubBar';
class  Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.userInfo.email,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({username: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.username);
    }
    render() {
        return(
            <div>
            <Navbar />
            <ProjectSubBar />
            <div className="container">
            <div className="form-container">
                <h1>Let's Talk</h1>
                <form onSubmit={this.handleSubmit} className="form">
                    <label htmlFor="email">You will enter the chat as: </label>
                    <input value={this.props.userInfo.email} type="email" name="username" onChange={this.handleChange} className="input" />
                    <button className="submit">Enter</button>
                </form>
            </div>
            </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext,
        userInfo: state.userInfo
    }
}
export default connect(mapStateToProps)(Signup);