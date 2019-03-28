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
   
    handleAccept = (project, notification) => {// handles accepting project invitation
        console.log(this.state.userInfo, "howdy")
        this.props.handleInvite(project, this.state.userInfo, notification)
        this.props.handleNotificationDelete(project, this.props.userInfo, notification)
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
    renderNotification = () => {
        var { notifications } = this.props
        if (typeof notifications === "undefined") {
            notifications = []
        }
        const NotificationsList = notifications.length ? (
            this.props.notifications.map(Notification => {
                //foe printing the date
                var date = Notification.date.split("T")
                var time = date[1].split(":")[0] + ":" + date[1].split(":")[1]
                if(Notification.kind === "PROJECT_INVITE"){
                    return (
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-primary">
                                        <h4 className="notiHead">Project Invitation</h4>
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
                    )
                }
                else if(Notification.kind === "DELETE_VOTE"){
                    return (
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-danger">
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
                }
                else if(Notification.kind === "NEW_TEAM_MEMBER"){
                    return(
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-info">
                                    <button className="close" onClick={() => { this.handleDelete(Notification, Notification.data.projectId) }}>
                                        <i className="material-icons">highlight_off</i>
                                    </button>
                                    <h4 className="notiHead">New team member</h4>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">New member <strong>{Notification.data.newTM.name}</strong> has join the project <strong>{Notification.data.project_title}</strong></p>
                                    </div>
                                </div>
                                <div className="pt-2">{date[0]} {time}</div>
                            </div>
                        </div>
                    )
                }
                else if(Notification.kind === "ASSIGN_TASK") {
                    return(
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-info">
                                    <button className="close" onClick={() => { this.handleDelete(Notification, Notification.data.projectId) }}>
                                        <i className="material-icons">highlight_off</i>
                                    </button>
                                    <h4 className="notiHead">New task Assignment</h4>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">You have been assigned to task <strong>{Notification.data.assignedTask_name}</strong> in project <strong>{Notification.data.project_title}</strong> by <strong>{Notification.data.assignedTM.assigner}</strong></p>
                                    </div>
                                </div>
                                <div className="pt-2">{date[0]} {time}</div>
                            </div>
                        </div>
                    )
                }
                else if(Notification.kind === "NEW_COMMENT") {
                    return(
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-info">
                                    <button className="close" onClick={() => { this.handleDelete(Notification, Notification.data.projectId) }}>
                                        <i className="material-icons">highlight_off</i>
                                    </button>
                                    <h4 className="notiHead">New comment</h4>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text"><strong>{Notification.data.author}</strong> just wrote a comment in task <strong>{Notification.data.watchedTask_name}</strong> of project <strong>{Notification.data.project_title}</strong></p>
                                    </div>
                                </div>
                                <div className="pt-2">{date[0]} {time}</div>
                            </div>
                        </div>
                    )
                }
                else if(Notification.kind === "EDITTING_TASK") {
                    return(
                        <div className="container pt-3" key={Notification._id}>
                            <div class="card text-center" >
                                <div>
                                    <div className="alert alert-info">
                                    <button className="close" onClick={() => { this.handleDelete(Notification, Notification.data.projectId) }}>
                                        <i className="material-icons">highlight_off</i>
                                    </button>
                                    <h4 className="notiHead">New changes on task</h4>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text"><strong>{Notification.data.editor}</strong> modefied task <strong>{Notification.data.watchedTask_name}</strong> of project <strong>{Notification.data.project_title}</strong></p>
                                    </div>
                                </div>
                                <div className="pt-2">{date[0]} {time}</div>
                            </div>
                        </div>
                    )
                }
            })
        ) : (//parent predecate
        <img src={require('../../No-Notifications.png')} width="350" height="350"/>
        )
        return NotificationsList
    }
    render() {
        return (
            <div>{this.renderNotification()}</div>
            
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