import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleInvite, handleNotificationDelete } from '../../store/actionCreators/projectActions'


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
    handleAccept = (project, notification) => {
        console.log(project, "howdy")
        this.props.handleInvite(project, this.state.userInfo, notification)
        // window.location.reload()
        // this.props.history.push('/home');
        // window.location.reload()
    }
    handleDelete = (notification, projectId) =>{
        this.props.handleNotificationDelete(projectId, this.state.userInfo, notification)

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
                                    
                                    <a onClick={() => { this.handleDelete(Notification, Notification.data.projectId) }}>
                                        <i className="material-icons Xicon">highlight_off</i>
                                    </a>
                            </div>
                            <div class="card-body">
                            <p class="card-text">You have been invited to {Notification.data.title} by {Notification.data.creator} do you accept?</p>
                            <button onClick={() => {this.handleAccept(Notification.data.projectId, Notification)} } class="btn btn-primary">Accept invite </button>
                            </div>
                            <div className="pt-2">{date[0]} {time}</div>
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
        handleInvite: (project, userInfo, notification) => { dispatch(handleInvite(project, userInfo, notification)) },
        handleNotificationDelete : (projectId, userInfo, notification) => {dispatch(handleNotificationDelete(projectId, userInfo, notification))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notification)