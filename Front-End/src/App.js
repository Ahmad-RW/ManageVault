import React, { Component } from 'react';
import './App.css';
import Login from './components/accessing the system/login';
import WelcomeScreen from './components/accessing the system/WelcomeScreen'
import NavBar from './components/layout/Navbar'
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom'
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
import PublicStorage from './components/storage/PublicStorage';
import ViewPublicProject from './components/storage/ViewPublicProject';
import qs from 'query-string'
import Axios from 'axios';

class App extends Component {
  

  componentWillMount(){
    const token = localStorage.getItem('token');//user email NOT TO BE CONFUSED WITH GOOGLE API TOKEN !!!!!!!!!!!!
    if (token) {
      this.props.fetchUserInfo(token)
      this.props.fetchUserProjects(token)
      this.props.authenticate()
     const code =  qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).code
     if(typeof code === "undefined"){
       return
     }
     const payload = {
       code,
       userEmail : token
     }
     Axios.post("http://localhost:3333/setAccessToken", {payload} ).then((res)=>{
       console.log(res)
     }).catch((execption)=>{
       console.log(execption)
     })
     console.log(this.props)
     console.log(code)
    }


  }
  
  render() {
 
    return (
     
      
      
        <div className="App">
          <NavBar />
          
          <Switch>
            <Route exact path='/' component={WelcomeScreen} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route exact path='/home' component={RequireAuth(Home)} />
            <Route path='/notification' component={RequireAuth(Notification)} />
            <Route exact path='/publicStorage' component={RequireAuth(PublicStorage)} />
            <Route path='/publicStorage/viewProject' component={RequireAuth(ViewPublicProject)} />
            <Route path='/home/newproject' component={RequireAuth(CreateProject)} />
            <Route exact path='/home/projectSettings' component={RequireAuth(ProjectSettings)} />
            <Route path='/home/projectSettings/grantAuthority' component={RequireAuth(GrantAuthorities)} />
            <Route path='/home/projectSettings/newRole' component={RequireAuth(userDefinedRoles)} />
            <Route exact path='/home/projectWorkSpace' component={RequireAuth(WorkSpace)} />
            <Route path='/home/projectWorkSpace/board' component={RequireAuth(Board)} />
            <Route path='/home/projectWorkSpace/storage' component={RequireAuth(Storage)} />

          </Switch>
          
        </div>
      
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



export default withRouter(connect(null, mapDispatchToProps)(App))