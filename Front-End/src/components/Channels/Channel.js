import React, { Component } from 'react';
import ChatMessage from './ChatMessage';
import Signup from './Signup';
import ChatApp from './ChatApp'; 
import { default as Chatkit } from '@pusher/chatkit-server';


const chatkit = new Chatkit({
  instanceLocator: "v1:us1:284bc324-9274-4bee-b49f-efd146384063",
  key: "8e5a1191-4999-417c-87e3-a2ccb54c775b:EgBlYSiXIv9TFfqSM/cQxO9ECOR5jXhemLqcHCwNrhE="
})


class Channel extends Component {
  constructor(props) {
      super(props);
      this.state = {
          currentUsername: '',
          currentId: '',
          currentView: 'signup'
      }
      this.changeView = this.changeView.bind(this);
      this.createUser = this.createUser.bind(this);
  }

  createUser(username) {
      chatkit.createUser({
          id: username, 
          name: username,
      })
      .then((currentUser) => {
          this.setState({
              currentUsername: username,
              currentId: username,
              currentView: 'chatApp'
          })
      }).catch((err) => {
            if(err.status === 400) {
              this.setState({
                  currentUsername: username,
                  currentId: username,
                  currentView: 'chatApp'
              })
          } else {
              console.log(err.status);
          }
      });
  }

changeView(view) {
    this.setState({
        currentView: view
    })
}

render() {
      let view ='';

      if (this.state.currentView === "ChatMessage") {
          view = <ChatMessage  changeView={this.changeView}/>
      } else if (this.state.currentView === "signup") {
          view = <Signup onSubmit={this.createUser}/>
      } else if (this.state.currentView === "chatApp") {
          view = <ChatApp currentId={this.state.currentId}/>
      }
      return (
          <div className="App">
              {view}
          </div>
      );
  }
}
export default Channel;
