import React, { Component } from 'react';
import './App.css';
import Login from './components/accessing the system/login';
import WelcomeScreen from './components/accessing the system/WelcomeScreen'
import NavBar from './components/layout/Navbar'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Register from './components/accessing the system/register';
import Home from './components/initiating project/Home';
import RequireAuth from './HOCs/require_auth';
import { connect } from 'react-redux'
import CreateProject from './components/initiating project/createProject';
import {authenticate, fetchUserInfo} from './store/actionCreators/authAction'
import { fetchUserProjects } from './store/actionCreators/projectActions';
class App extends Component {
  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.fetchUserInfo(token)
      this.props.fetchUserProjects(token)
      this.props.authenticate()
    }
  }
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          
          <Switch>
            <Route exact path='/' component={WelcomeScreen} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/home' component={RequireAuth(Home)} />
            <Route path='/newproject' component={RequireAuth(CreateProject)} />
          </Switch>
          
        </div>
      </BrowserRouter>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    authenticate: () => {
      dispatch({ type: "AUTHENTICATE_THE_USER" })
    },
    fetchUserInfo : (userEmail) => dispatch(fetchUserInfo(userEmail)),
    fetchUserProjects : (userEmail) => dispatch(fetchUserProjects(userEmail))
  }
}


export default connect(null, mapDispatchToProps)(App);
