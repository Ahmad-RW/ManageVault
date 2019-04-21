import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './homepage.css'
import $ from 'jquery'

const NavBar = {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 0,
    width: '100%',
    transition: 'background 0.6s ease-in',
    zIndex: 99999,
    fontSize: '1.3rem'
};

const NavBrand = {
    fontFamily: 'Lobster, cursive',
    fontSize: '1.5rem'
};

const pTAG = {
    marginBottom: '0.5em',
    fontSize: '1.3rem',
    lineHeight: 1.6
};

const h1TAG = {
    marginBottom: '0.5em',
    fontSize: '2.6rem'
};
class WelcomeScreen extends Component {
    renderLandingPage = () => {
        return (
            <div>
                <header class="header-area overlay">
                    <nav class="navbar navbar-expand-md navbar-dark" style={NavBar}>
                        <div class="container">
                            <a class="navbar-brand" style={NavBrand}>ManageVault</a>
                            <div id="main-nav" class="collapse navbar-collapse">
                                <ul class="navbar-nav ml-auto" id="WCnavbar">
                                    <li><a href="#" class="nav-item nav-link active" id='WC'>Home</a></li>
                                    <li><a href="#" class="nav-item nav-link">About Us</a></li>
                                    <li><a href="#" class="nav-item nav-link">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <div class="banner">
                        <div class="container">
                            <h1 style={h1TAG}>ManageVault</h1>
                            <p style={pTAG}>The easiest and most convenient FREE project management web application made especially for students.
                Manage your project effectively and effeciently using ManageVault.</p>
                            <a><Link to="/login"> <button className="button button-primary"> Sign In </button> </Link></a>
                            <a><Link to="/register"> <button className="button button-primary"> Register </button> </Link></a>
                        </div>
                    </div>
                </header>
            </div>
        )
    }
    LandingPageJquery = () => {
        return (
            $(function ($) {
                $(window).on('scroll', function () {
                    if ($(this).scrollTop() >= 200) {
                        $('.navbar').addClass('fixed-top');
                    } else if ($(this).scrollTop() == 0) {
                        $('.navbar').removeClass('fixed-top');
                    }
                });

                function adjustNav() {
                    var winWidth = $(window).width(),
                        dropdown = $('.dropdown'),
                        dropdownMenu = $('.dropdown-menu');

                    if (winWidth >= 768) {
                        dropdown.on('mouseenter', function () {
                            $(this).addClass('show')
                                .children(dropdownMenu).addClass('show');
                        });

                        dropdown.on('mouseleave', function () {
                            $(this).removeClass('show')
                                .children(dropdownMenu).removeClass('show');
                        });
                    } else {
                        dropdown.off('mouseenter mouseleave');
                    }
                }

                $(window).on('resize', adjustNav);

                adjustNav();
            })
        )
    }
    render() {
        if (this.props.authenticated) {
            this.props.history.push('/home')
        }
        return (
            <div>
                {this.renderLandingPage()}
                {/* {this.LandingPageJquery().toString()} */}
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return { authenticated: state.isAuthenticated }
}

export default connect(mapStateToProps)(WelcomeScreen)