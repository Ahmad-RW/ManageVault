import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleInvite, handleVoting, handleNotificationDelete } from '../../store/actionCreators/projectActions'


class Notification extends Component {
    constructor(props) {
        super(props)
        console.log(props)
    }
    state = {
        userInfo: this.props.userInfo,
        notifications: []
    }
    // componentWillMount() {
    //     console.log(this.props.isAuthenticated)
    //     let listLength = this.props.notifications.length
    //     console.log(listLength, "Hereeeee")
    //     if (this.props.isAuthenticated === false) {
    //         this.props.history.push("/")
    //     }
    // }
    handleAccept = (project, notification) => {// handles accepting project invitation
        console.log(this.state.userInfo, "howdy")
        this.props.handleInvite(project, this.state.userInfo, notification)
        this.props.handleNotificationDelete(project, this.props.userInfo, notification)

        // window.location.reload()
        // this.props.history.push('/home');
        // window.location.reload()
    }
    handleDelete = (notification, projectId) =>{// deletes a notification from the store and database. my very own baby.
        this.props.handleNotificationDelete(projectId, this.props.userInfo, notification)

    }
    handleClick = (e, projectId, notification, userInfo) => {// delete Request
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
        this.props.handleNotificationDelete(projectId, userInfo, notification)
    }
    render() {
        
        var { notifications } = this.props
        if (typeof notifications === "undefined") {
            notifications = []
        }
        
        const NotificationsList = notifications.length ? (
            this.props.notifications.map(Notification => {
                //foe printing the date
                var date = Notification.date.split("T")
                var time = date[1].split(":")[0] + ":" + date[1].split(":")[1]
                return (
                    Notification.kind === "PROJECT_INVITE" ? (
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-primary">
                                        <h4 className="notiHead">Project Invitation</h4>

                                        <button className="close" data-dismiss="alert" aria-label="Close"  onClick={() => { this.handleDelete(Notification, Notification.data.projectId) }} hidden>
                                        <i className="material-icons">highlight_off</i>
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">You have been invited to {Notification.data.title} by {Notification.data.creator} do you accept?</p>
                                        <button onClick={() => { this.handleAccept(Notification.data.projectId, Notification) }} class="btn btn-primary">Yes </button>
                                        <button value="no" onClick={() => { this.handleDelete(Notification, Notification.data.projectId) }} class="btn btn-danger">No</button>
                                    </div>
                                </div>
                                <div className="pt-2">{date[0]} {time}</div>
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
                                        <button value="yes" onClick={(e) => {this.handleClick(e, Notification.data.projectId, Notification, this.props.userInfo)}} className="btn btn-primary">Yes </button>
                                        <button value="no" onClick={(e) => {this.handleClick(e, Notification.data.projectId, Notification, this.props.userInfo)}} className="btn btn-danger">No</button>
                                    </div>
                                </div>
                                <div className="pt-2">{date[0]} {time}</div>
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
        handleRequest: (payload) => {dispatch(handleVoting(payload))},
        handleNotificationDelete : (projectId, userInfo, notification) => {dispatch(handleNotificationDelete(projectId, userInfo, notification))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notification)