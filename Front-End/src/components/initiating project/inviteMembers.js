import React, { Component } from 'react'
import {connect} from 'react-redux'
import {inviteMoreMembers} from '../../store/actionCreators/projectActions'
class InviteMembers extends Component {

    state = {
        invitedMembers :""
    }

    handleChange = (e) =>{
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleClick = (e) =>{
        e.preventDefault()
        this.props.inviteMembers(this.state.invitedMembers, this.props.project, this.props.userInfo )
        window.location.reload()// necessery.
    }

    render() {
        return (
            <form>
            <div className="form-group">
                <label>Invite More Members</label>
                <input type="text" className="form-control" onChange={this.handleChange} id="invitedMembers" />
                <small className='form-text text-muted'>Enter each email seperated by commas</small>
                <button type="submit" className="btn btn-primary " onClick= {this.handleClick} >Invite Members</button>
            </div>
            </form>
        )
    }
}


const mapStateToProps = (state) =>{
    return{
        userInfo : state.userInfo
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        inviteMembers : (invitedUsers, project , userInfo) => dispatch(inviteMoreMembers(invitedUsers, project, userInfo))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InviteMembers)