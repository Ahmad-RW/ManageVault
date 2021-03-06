import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import fb from '../../FirebaseConfig/authConfig'
import { withRouter } from 'react-router-dom'
import BC from './BC';

class NavBar extends Component {
    constructor(props) {
        super(props)
    }
    handleSignOut = (e) => {
        this.props.history.push('/')//temp solution
        console.log(e)
        fb.auth().signOut().then((e) => {
            try {
                this.props.removeAuth()
                //this.props.history.push('/')
                localStorage.removeItem('perState')
                localStorage.removeItem('token')
            }
            catch (e) {
                console.log(e)
            }
        }).catch((e) => {
            console.log(e, 'exception')
        })
    }
    renderNotificationIcon = () => {
        var icon = <Link class="btn btn-dark my-2 my-sm-0" to="/notification"><i class="material-icons">notification_important</i></Link>
        // if(this.props.userInfo.notifications.length === 0){
        //     icon = <Link class="btn btn-dark my-2 my-sm-0" to="/notification"><i class="material-icons">notification_important</i></Link>
        // }else{
        //     icon = <Link class="btn btn-dark my-2 my-sm-0" to="/notification"><i class="material-icons redIcon">notification_important</i></Link>
        // }
        return icon
    }
    render() {//if he is signed in we render different Navbar
        const navbar = this.props.authenticated ? (
            <div className="sticky-top">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark navBarPadding">
                <Link to="/" class="navbar-brand" class="ManageVault">ManageVault</Link>
                    {/* <Link className="navbar-brand" to="/"><img src={require('../../favicon.ico')} width="30" height="30" alt="logo" /></Link> */}
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse NavElements" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <Link className="nav-item nav-link" to='/home'>Home</Link>
                            <Link className="nav-item nav-link" onClick={this.handleSignOut} to='#'>Sign Out</Link>
                            <Link className="nav-item nav-link" to="/publicStorage">Public Projects</Link>
                        </div>
                        <div className="navbar-nav" >
                            <BC />
                        </div>
                    </div>
                    <div className="mx-auto welcome-badge nav-item nav-link navWelcome"  >
                        {this.renderNotificationIcon()}
                        Welcome {this.props.userInfo.name}
                    </div>
                </nav>
            </div>
        ) : (//ture : false
                <div className="UnAuth-sticky-top">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <Link to="/" class="navbar-brand" class="ManageVault">ManageVault</Link>
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
                </div>
                )

        return (navbar)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        authenticated: state.isAuthenticated,
        userInfo: state.userInfo
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        removeAuth: () => {
            dispatch({ type: 'REMOVE_AUTH' })
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))

