import React, { Component } from 'react';
import './App.css';
import Login from './components/accessing the system/login';
import WelcomeScreen from './components/accessing the system/WelcomeScreen'
import NavBar from './components/layout/Navbar'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Register from './components/accessing the system/register';
import Home from './components/initiating project/Home';
import ProjectSettings from './components/initiating project/projectSettings';
import RequireAuth from './HOCs/require_auth';
import { connect } from 'react-redux'
import CreateProject from './components/initiating project/createProject';
import {authenticate, fetchUserInfo} from './store/actionCreators/authAction'
import { fetchUserProjects, setProject } from './store/actionCreators/projectActions';
import Notification from './components/initiating project/Notification'
import WorkSpace from './components/Task/Workspace'
import GrantAuthorities from './components/initiating project/grantAuthority';
import Board from './components/Task/Board';
import userDefinedRoles from './components/initiating project/userDefinedRoles';
import Storage from './components/storage/storage'

class App extends Component {
  

  componentWillMount(){
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
            <Route exact path='/home' component={RequireAuth(Home)} />
            <Route path='/notification' component={RequireAuth(Notification)} />
            <Route path='/home/newproject' component={RequireAuth(CreateProject)} />
            <Route exact path='/home/projectSettings' component={RequireAuth(ProjectSettings)} />
            <Route path='/home/projectSettings/grantAuthority' component={RequireAuth(GrantAuthorities)} />
            <Route path='/home/projectSettings/newRole' component={RequireAuth(userDefinedRoles)} />
            <Route exact path='/home/projectWorkSpace' component={RequireAuth(WorkSpace)} />
            <Route path='/home/projectWorkSpace/board' component={RequireAuth(Board)} />
            <Route path='/home/projectWorkSpace/storage' component={RequireAuth(Storage)} />

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
    fetchUserProjects : (userEmail) => dispatch(fetchUserProjects(userEmail)),
    setProject : (project) => dispatch(setProject(project))
  }
}


export default connect(null, mapDispatchToProps)(App);
