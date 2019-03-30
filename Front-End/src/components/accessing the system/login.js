import React, { Component } from 'react'
import fb from '../../FirebaseConfig/authConfig';
import { connect } from 'react-redux';
import { fetchUserInfo } from '../../store/actionCreators/authAction'
import { fetchUserProjects } from '../../store/actionCreators/projectActions'
import Navbar from '../layout/Navbar'

class Login extends Component {
    state = {
        email: '',
        password: ''
    }
    constructor(props) {
        super(props)
        console.log(props, "log in constrct")
    }

    handlechange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        console.log(this.state)

    }
    handelClick = (e) => {
        e.preventDefault();
        fb.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
            console.log(res)
            localStorage.setItem('token', this.state.email)
            this.props.authenticate()
            this.props.fetchUserInfo(this.state.email)
            this.props.fetchUserProjects(this.state.email)
            this.props.history.push('/home');//redirection
        }).catch((exception) => {
            console.log(exception)
            alert("wrong email or password")
        })
    }
    render() {
        return (
            <div>
            <Navbar />
            <div class="container">
                <div class="row">
                    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div class="card card-signin my-5">
                         <h5 className="card-title">Sign in</h5>
                            <form className="form-signin" onSubmit={this.handelClick}>
                                    <div className="card-body" >
                                        <label>Email Address</label>
                                        <input type="email" className="form-control" id="email" placeholder="Email" onChange={this.handlechange} />
                                        <label>Password</label>
                                        <input type="password" className="form-control" id="password" placeholder="password" onChange={this.handlechange} />
                                        <button className="form-control btn btn-info sign-in-button" type="submit" onClick={this.handelClick}>Sign In</button>
                                    </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        authenticate: () => {
            dispatch({ type: "AUTHENTICATE_THE_USER" })
        },
        fetchUserInfo: (userEmail) => dispatch(fetchUserInfo(userEmail)),
        fetchUserProjects: (userEmail) => dispatch(fetchUserProjects(userEmail))

    }
}

export default connect(null, mapDispatchToProps)(Login)