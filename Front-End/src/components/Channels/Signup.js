import React, {Component} from 'react';
import {connect}from 'react-redux'
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
            <div className="form-container">
                <h1>Let's Talk</h1>
                <form onSubmit={this.handleSubmit} className="form">
                    <label htmlFor="email">What is your email?</label>
                    <input value={this.props.userInfo.email} type="email" name="username" onChange={this.handleChange} className="input" />
                    <button className="submit">Submit</button>
                </form>
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