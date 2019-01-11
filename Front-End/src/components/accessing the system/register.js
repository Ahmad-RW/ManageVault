import React, { Component } from 'react';
import fb from '../FirebaseConfig/authConfig';
import axios from 'axios';
class Register extends Component {
    state = {
        username: "",
        name: "",
        password: "",
        email: ""
    }
    handlechange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        console.log(this.state)
    }
    handleClick = (e) => {
        e.preventDefault()
        console.log(e)
        fb.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
            console.log(res)
           this.postToServer();
           localStorage.setItem('token', "cookie")
           this.props.history.push('/home')// a redirection to home after succeful sign up 
        }).catch((exception) => {
            console.log(exception)
        })
    
    }
    postToServer = () =>{
        axios.post('http://localhost:3333/newuser', {
            username : this.state.username,
            name : this.state.name,
            password : this.state.password,
            email : this.state.email
        }).then((res)=>{
            console.log(res)
            
        }).catch((exception)=>{
            console.log(exception)
        })
    }
    render() {
        return (
            <div className="card container ">
                <div className="form-group card-body" >
                    <form onSubmit={this.handleClick}>
                        <label>Email Address</label>
                        <input type="email" className="form-control" id="email" placeholder="Email" onChange={this.handlechange} />
                        <label>Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handlechange} />
                        <label>Name</label>
                        <input type="text" className="form-control" id="name" placeholder="Name" onChange={this.handlechange} />
                        <label>Username</label>
                        <input type="text" className="form-control" id="username" placeholder="Username" onChange={this.handlechange} />
                        <button className="form-control btn btn-info sign-in-button" type="submit" y>Open the Vault</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Register