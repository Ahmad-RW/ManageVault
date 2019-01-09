import React, { Component } from 'react';
import './App.css';
import Login from './components/login';
import WelcomeScreen from './components/WelcomeScreen'
import NavBar from './components/Navbar'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Register from './components/register';
import Home from './components/Home';
import RequireAuth from './HOCs/require_auth';
import { connect } from 'react-redux'


class App extends Component {
  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
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
    }
  }
}

export default connect(null, mapDispatchToProps)(App);
