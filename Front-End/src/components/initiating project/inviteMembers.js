import React, { Component } from 'react'
import {connect} from 'react-redux'
import {inviteMoreMembers, findUsers} from '../../store/actionCreators/projectActions'

class InviteMembers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            invitedMembers :"",
            selectedUsers :[],// how to convert array of strings to string do your own function
            selectedMembers:""
        }
    }


    handleChange = (e) =>{
        this.props.findUsers(e.target.value)
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    handleSubmit = (e) =>{
        e.preventDefault()
        this.props.inviteMembers(this.state.selectedMembers, this.props.project, this.props.userInfo )
        window.location.reload()// necessery.
    }
    renderUsers = () => {
        console.log(this.props.users)
        // if(this.props.users.email === undefined){return}
        const users = this.props.users.map(user => {//stuck here
            return (
                <div>
                <li role="presentation"><a onClick={() => {this.handleSelectingUser(user)}}role="menuitem" tabindex="-1" >{user.email}</a></li>
                <div class="dropdown-divider"></div>
                </div>
        )}
        )
        return users
    }
    handleSelectingUser = (user) =>{
        console.log(user.email)
        let newselectedMembers = this.state.selectedMembers + user.email + ","
        let newSelectedUser = [...this.state.selectedUsers,user]
        console.log(newSelectedUser)
        this.setState({
            ...this.state,
            selectedUsers:newSelectedUser
        },function(){
            console.log(this.state.selectedUsers,"selectedUsers")
            this.setState({
                ...this.state,
                selectedMembers:newselectedMembers
            },function(){
                console.log(this.state.selectedMembers,"selectedMembers")
            })
        })
        
    }
    renderSelectedUsers = () => {
        console.log(this.state.selectedUsers,"whats renderd")
        let selectedUsers = this.state.selectedUsers.map(user => {
            return(
                <div>
                    {user.email}
                    <button className="close" data-dismiss="alert" aria-label="Close">
                    <i className="material-icons">highlight_off</i>
                    </button>
                </div>
            )
        })
        return selectedUsers
    }
    deleteSelectedUser = () => {

    }
    render() {
        return (
            <form>
            <div className="form-group">
                <label>Invite More Members</label>
                <input data-toggle="dropdown"type="text" className="form-control" onChange={this.handleChange} id="invitedMembers" />
                <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                    {this.renderUsers()}
                </ul>
                <small className='form-text text-muted'>Enter each email seperated by commas</small>
                <button type="submit" className="btn btn-primary " onClick= {this.handleSubmit} >Invite Members</button>
                {this.renderSelectedUsers()}
            </div>
            </form>
        )
    }
}


const mapStateToProps = (state) =>{
    return{
        userInfo : state.userInfo,
        users : state.users
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        inviteMembers : (invitedUsers, project , userInfo) => dispatch(inviteMoreMembers(invitedUsers, project, userInfo)),
        findUsers: (searchQuery) => dispatch(findUsers(searchQuery))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InviteMembers)