import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestDeleteAction } from '../../store/actionCreators/projectActions';

class RequestDelete extends Component {
    handleClick = (e) => {
        this.props.requestDelete(this.props.project);
       // this.props.history.push('/home'); //Redirect on the same page without having to refresh.
    }

    render () {
        return (
            <div className="container">
                <Link to='#' id='link' onClick={this.handleClick}>Delete Project</Link>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestDelete: (project) => { dispatch(requestDeleteAction(project)) }
    }
}

export default connect(null, mapDispatchToProps)(RequestDelete);