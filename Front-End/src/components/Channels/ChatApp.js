import React, {Component} from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import Input from './Input';
import MessageList from './MessageList';
import {connect} from 'react-redux'
import Navbar from '../layout/Navbar';
import ProjectSubBar from '../layout/projectSubBar';
class ChatApp extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            currentUser: null,
            currentRoom: {users:[]},
            messages: [],
            users: []
        }
        this.addMessage = this.addMessage.bind(this);
    }
    componentWillMount() {
        const chatManager = new ChatManager({
            instanceLocator: "v1:us1:284bc324-9274-4bee-b49f-efd146384063",
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/284bc324-9274-4bee-b49f-efd146384063/token"
            })
        })
        chatManager
        .connect()
        .then(currentUser => {
            this.setState({ currentUser: currentUser })
            return currentUser.subscribeToRoom({
                roomId: this.props.projectInContext.chatRoomId,
                messageLimit: 100,
                hooks: {
                    onMessage: message => {
                        this.setState({
                            messages: [...this.state.messages, message],
                        })
                    },
                }
            })
        })
        .then(currentRoom => {
            this.setState({
                currentRoom,
                users: currentRoom.userIds
            })
        })
        .catch(error => console.log(error))
      }
      addMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
        .catch(error => console.error('error', error));
    }
    render() {
        return (
            <div>
            <Navbar />
            <ProjectSubBar />
            <div className="container">
                <div className="chat-title">
                <h2 className="header">{this.state.currentRoom.name}</h2>
                <MessageList messages={this.state.messages} />
                <Input className="input-field" onSubmit={this.addMessage} />
                </div>
            </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext,
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps)(ChatApp);