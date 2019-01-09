import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function (ComposedComponent) {

  // If user not authenticated render out to root

  class Authentication extends Component {
    
    constructor(props){
      super(props)
      console.log(props, "require auth")
    }
    componentWillMount() {
      if (!this.props.authenticated) {
        this.props.history.push('/')
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
    return { authenticated: state.isAuthenticated };
  }

  return connect(mapStateToProps)(Authentication);
}