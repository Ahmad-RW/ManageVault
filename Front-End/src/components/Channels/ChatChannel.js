// import React, {Component} from 'react'

// class ChatChannel extends Component {
//     constructor() {
//         super()
//         this.state = {
//             messages: []
//         }
//         this.sendMessage = this.sendMessage.bind(this)
//     } 
    
//     componentDidMount() {
//         const chatManager = new Chatkit.ChatManager({
//             instanceLocator: "v1:us1:284bc324-9274-4bee-b49f-efd146384063",
//             userId: "saud",
//             tokenProvider: tokenProvider
//           })
        
//         chatManager.connect()
//         .then(currentUser => {
//             this.currentUser = currentUser
//             this.currentUser.subscribeToRoom({
//             roomId: roomId,
//             hooks: {
//                 onNewMessage: message => {
//                     this.setState({
//                         messages: [...this.state.messages, message]
//                     })
//                 }
//             }
//         })
//       })
//     }
    
//     sendMessage(text) {
//         this.currentUser.sendMessage({
//             text,
//             roomId: roomId
//         })
//     }
    
//     render() {
//         return (
//             <div>
//               <Title />
//               <MessageList roomId={this.state.roomId} messages={this.state.messages} />
//               <SendMessageForm sendMessage={this.sendMessage} />
//             </div>
//         )
//     }
// }

// export default ChatChannel;