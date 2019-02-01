import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleInvite, handleVoting } from '../../store/actionCreators/projectActions'

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
    handleClick = (e, projectId, notification, userInfo) => {
        let payload = {
            projectId,
            notification,
            userInfo
        }
        console.log(projectId, "PID")
        console.log(e.target.value);
        if (e.target.value === 'yes'){
            payload = {
                ...payload,
                yes: true
            }
        }
        else{
            payload = {
                ...payload,
                yes: false
            }
        }
        this.props.handleRequest(payload)
    }
    render() {
        
        
        if(this.props.authenticated === false){
            this.props.history.push('/')
        }
        const { notifications } = this.props
        const NotificationsList = notifications.length ? (
            this.props.notifications.map(Notification => {
                return (
                    Notification.kind === "PROJECT_INVITE" ? (
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-primary">
                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                                        <h4 className="notiHead">Project Invitation</h4>

                                        <a onClick={() => { this.handleClick(Notification.id) }}>
                                            <i className="material-icons Xicon">highlight_off</i>
                                        </a>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">You have been invited to {Notification.data.title} by {Notification.data.creator} do you accept?</p>
                                        <button onClick={() => { this.handleAccept(Notification.data.projectId, Notification) }} class="btn btn-primary">Accept invite </button>
                                    </div>
                                    <div className="pt-2">{Notification.date}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-primary">
                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                                        <h4 className="notiHead">Delete request</h4>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">The team leader requested to delete {Notification.data.title}, do you accept?</p>
                                        <button value="yes" onClick={(e) => {this.handleClick(e, Notification.data.projectId, Notification, this.props.userInfo)}} class="btn btn-danger">Accept delete</button>
                                        <button value="no" onClick={(e) => {this.handleClick(e, Notification.data.projectId, Notification, this.props.userInfo)}} class="btn btn-primary">Decline delete </button>
                                    </div>
                                    <div className="pt-2">{Notification.date}</div>
                                </div>
                            </div>
                        </div>
                    )

                )//return 
            })
        ) : (//parent predecate
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
        handleInvite: (project, userInfo, notification) => { dispatch(handleInvite(project, userInfo, notification)) },
        handleRequest: (payload) => {dispatch(handleVoting(payload))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notification)