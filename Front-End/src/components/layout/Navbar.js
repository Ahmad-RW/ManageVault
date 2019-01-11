import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import fb from '../../FirebaseConfig/authConfig'
class NavBar extends Component {
    constructor(props) {
        super(props)
        console.log(props, 'navbar cons')
    }
    handleSignOut = (e) =>{
        console.log(e)
        fb.auth().signOut().then((e)=>{
            console.log(e, 'signed out')
            this.props.removeAuth()
            localStorage.removeItem('token')
        }).catch((e)=>{
            console.log(e, 'exception')
        })
    }
    render() {//if he is signed in we render different Navbar
        const navbar = this.props.authenticated ? ( 
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link className="navbar-brand" to="/"><img alt="manage vault logo" src={require('../../favicon.ico')} /></Link>
                        </div>
                        <ul className="nav navbar-nav">
                            <li><Link to="#">Home</Link></li>
                            <li><Link to="#">Page 1</Link></li>
                            <li><Link to="#">Page 2</Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link to="#" onClick={this.handleSignOut}><span className="glyphicon glyphicon-log-out"></span> Sign Out</Link></li>
                        </ul>
                    </div>
                </nav>
            </div>
        ) : (//ture : false
                <div>
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <Link className="navbar-brand" to="/"><img alt="manage vault logo" src={require('../../favicon.ico')} /></Link>
                            </div>
                            <ul className="nav navbar-nav">
                                <li><Link to="#">Home</Link></li>
                                <li><Link to="#">Page 1</Link></li>
                                <li><Link to="#">Page 2</Link></li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link to="/register"><span className="glyphicon glyphicon-user"></span> Sign Up</Link></li>
                                <li><Link to="#"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                            </ul>
                        </div>
                    </nav>
                </div>)

        return (navbar)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        authenticated: state.isAuthenticated
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        removeAuth : () =>{
            dispatch({type : 'REMOVE_AUTH'})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)