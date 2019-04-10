import React, {Component} from 'react';

    class MessageList extends Component {
        render() {
            return(
                <div className="container">
                <ul className="message-list">
                    {this.props.messages.map((message, index) => (
                        <li key={index}>
                            <h4 className="message-sender">{message.senderId}</h4>
                            <p className="message-text">{message.text}</p>
                        </li>
                    ))}
                    <li></li>
                </ul>
                </div>
            )
        }
    }
    export default MessageList;