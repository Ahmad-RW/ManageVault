import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function (ComposedComponent) {

  // If user not authenticated render out to root

  class Authentication extends Component {
    
    constructor(props){
      super(props)
      
    }
    componentWillMount() {
      if (!this.props.authenticated) {
        if (localStorage.getItem("token") === null) {
          this.props.history.push('/')
        }
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
          this.props.history.push('/')
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.isAuthenticated,
    projectInContext : state.projectInContext };
  }

  return connect(mapStateToProps)(Authentication);
}