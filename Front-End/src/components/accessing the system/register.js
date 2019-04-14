import React, { Component } from 'react';
import fb from '../../FirebaseConfig/authConfig';
import axios from 'axios';
import Navbar from '../layout/Navbar'
import { connect } from 'react-redux'
class Register extends Component {
    state = {
        name: "",
        password: "",
        email: "",
        warningMessage: <h2></h2>,
        startSpinner: false,
    }
    handlechange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        console.log(this.state)
    }
    handleClick = (e) => {
        e.preventDefault()
        this.setState({ ...this.state, startSpinner: true })
        console.log(e)
        fb.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
            console.log(res)
            this.postToServer()

        }).catch((exception) => {
            console.log(exception)
            this.setState({
                warningMessage: <div className="alert alert-danger" role="alert">{exception.message} </div>,
                startSpinner: false
            })
        })

    }
    postToServer = () => {
        axios.post('http://localhost:3333/user/newuser', {
            name: this.state.name,
            password: this.state.password,
            email: this.state.email
        }).then((res) => {
          this.props.history.push('/login')
        }).catch((exception) => {
            console.log(exception)
        })
    }

    login = () => {
        fb.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
            console.log(res)
            localStorage.setItem('token', this.state.email)
            this.props.authenticate()
            this.props.fetchUserInfo(this.state.email)
            this.props.fetchUserProjects(this.state.email)
            this.props.history.push('/home');//redirection

        }).catch((exception) => {
            console.log(exception)
            this.setState({ ...this.state, startSpinner: false })
            alert("wrong email or password")
        })
    }
    renderspinner = () => {
        if (this.state.startSpinner === true) {
            return (
                <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            )
        }
    }
    render() {
        return (
        <div>
                <Navbar />
                <div className="card container ">
                    <div className="form-group card-body" >
                        <form onSubmit={this.handleClick}>
                            {this.state.warningMessage}
                            <label>Email Address</label>
                            <input type="email" className="form-control" id="email" placeholder="Email" onChange={this.handlechange} />
                            <label>Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handlechange} />
                            <div className="row">
                                <div className="col">
                                    <label>Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Name" onChange={this.handlechange} />
                                </div>
                            </div>
                            <button className="form-control btn btn-info sign-in-button" type="submit" >Open the Vault</button>
                        </form>
                        {this.renderspinner()}
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
    }
}
export default connect(null, mapDispatchToProps)(Register)