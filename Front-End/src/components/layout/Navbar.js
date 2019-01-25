import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import fb from '../../FirebaseConfig/authConfig'
class NavBar extends Component {
    constructor(props) {
        super(props)
    }
    handleSignOut = (e) => {
        console.log(e)
        fb.auth().signOut().then((e) => {
            console.log(e, 'signed out')
            this.props.removeAuth()
            localStorage.removeItem('token')
        }).catch((e) => {
            console.log(e, 'exception')
        })
    }
    render() {//if he is signed in we render different Navbar
        const navbar = this.props.authenticated ? (
            <div>
                   <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link className="navbar-brand" to="/"><img src={require('../../favicon.ico')} width="30" height="30" alt="logo" /></Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                <Link className="nav-item nav-link" to='/home'>Home</Link>
                                <Link className="nav-item nav-link" onClick={this.handleSignOut} to='#'>Sign Out</Link>
                            </div>
                        </div>
                        <div className="mx-auto welcome-badge"  >
	                    <Link to="/notification"><i class="material-icons">notification_important</i></Link>
                            Welcome {this.props.userInfo.name}
                        </div>
                    </nav>
            </div>
        ) : (//ture : false
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link className="navbar-brand" to="/"><img src={require('../../favicon.ico')} width="30" height="30" alt="logo" /></Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                <Link className="nav-item nav-link" to='/register'>Register</Link>
                                <Link className="nav-item nav-link" to='/login'>Sign In</Link>
                            </div>
                        </div>
                    </nav>
                </div>)

        return (navbar)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        authenticated: state.isAuthenticated,
        userInfo : state.userInfo
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        removeAuth: () => {
            dispatch({ type: 'REMOVE_AUTH' })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)