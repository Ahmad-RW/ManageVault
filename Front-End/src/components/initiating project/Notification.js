import React, { Component } from 'react'

class Notification extends Component {
    state = {
        notifications: [
            { id: '1', content: "Lorem ipsum dolor sit amet"},
            { id: '2', content: "consectetur adipiscing elit. Nulla mattis sapien justo"},
            { id: '3', content: "Suspendisse in tortor sit amet nunc suscipit sodales"}
        ]
    }
    handleClick = (id) => {
        console.log(id)
        const notifications = this.state.notifications.filter(Notification => {
            return Notification.id !== id;
        })
        this.setState({
            notifications: notifications
        })
    }

    render() {
        const Notifications = this.state.notifications.map(Notification => {
            return (
                <div className="notification" key={Notification.id}>{Notification.content} <a onClick={() => { this.handleClick(Notification.id) }}><i className="material-icons">highlight_off</i></a>  </div>
            )
        })
        return (
            Notifications
        )
    }
}

export default Notification