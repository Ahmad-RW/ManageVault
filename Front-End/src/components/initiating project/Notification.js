import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleInvite } from '../../store/actionCreators/projectActions'

class Notification extends Component {
    constructor(props) {
        super(props)
        console.log(props)
    }
    state = {
        userInfo: this.props.userInfo
    }
    // componentWillMount() {
    //     console.log(this.props.isAuthenticated)
    //     let listLength = this.props.notifications.length
    //     console.log(listLength, "Hereeeee")
    //     if (this.props.isAuthenticated === false) {
    //         this.props.history.push("/")
    //     }
    // }
    handleAccept = (project, notification) => {
        console.log(project, "howdy")
        this.props.handleInvite(project, this.state.userInfo, notification)
        this.props.history.push('/home');
        window.location.reload()
    }
    render() {
        
        if(this.props.authenticated === false){
            this.props.history.push('/')
        }
        const { notifications } = this.props
        const NotificationsList = notifications.length ? (
            this.props.notifications.map(Notification => {
                return (
                    <div className="container pt-3" key={Notification._id}>
                    <div class="card text-center" >
                        <div>
                            <div className="alert alert-primary"> 
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                                {Notification.kind === "PROJECT_INVITE" ? (
                                    <h4 className="notiHead">Project Invitation</h4>
                                ) : (
                                    <h4 className="notiHead">Delete Request</h4>
                                    )
                                    } 
                                    
                                    <a onClick={() => { this.handleClick(Notification.id) }}>
                                        <i className="material-icons Xicon">highlight_off</i>
                                    </a>
                            </div>
                            <div class="card-body">
                            <p class="card-text">You have been invited to {Notification.data.title} by {Notification.data.creator} do you accept?</p>
                            <a onClick={() => {this.handleAccept(Notification.data.projectId, Notification)} } class="btn btn-primary">Accept invite </a>
                            </div>
                            <div className="pt-2">{Notification.date}</div>
                        </div>
                    </div>
                    </div>
                )
            })
        ) : (
            <div>You have no notification</div>
        )
        return (
            NotificationsList
        )
    }
}

const mapStateToProps = (state) => {
    return {
        notifications: state.userInfo.notifications,
        isAuthenticated: state.isAuthenticated,
        userInfo: state.userInfo
    }
 }
const mapDispatchToProps = (dispatch) => {
    return {
        handleInvite: (project, userInfo, notification) => { dispatch(handleInvite(project, userInfo, notification)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notification)