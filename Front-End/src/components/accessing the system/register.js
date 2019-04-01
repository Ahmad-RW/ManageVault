import React, { Component } from 'react';
import fb from '../../FirebaseConfig/authConfig';
import axios from 'axios';
import Navbar from '../layout/Navbar'

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
        this.setState({...this.state,startSpinner:true})
        e.preventDefault()
        console.log(e)
        fb.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
            console.log(res)
            this.postToServer()
            localStorage.setItem('token', "cookie")
        }).catch((exception) => {
            console.log(exception)
            this.setState({
                warningMessage: <div className="alert alert-danger" role="alert">{exception.message} </div>,
                startSpinner:false
            })
        })

    }
    postToServer = () => {
        axios.post('http://localhost:3333/user/newuser', {
            name: this.state.name,
            password: this.state.password,
            email: this.state.email
        }).then((res) => {
            console.log(res)
        }).catch((exception) => {
            console.log(exception)
        })
    }
    renderspinner = () => {
        if(this.state.startSpinner===true){
            return(
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
                            <div className="col">
                                <label>Last Name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Last Name" onChange={this.handlechange} />
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
export default(Register)