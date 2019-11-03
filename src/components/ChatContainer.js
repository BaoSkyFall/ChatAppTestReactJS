import React, { Component } from 'react';
import SideBar from './Sidebar'
import ChatHeading from './ChatHeading'
import Messages from './messages/Messages';
import MessageInput from './messages/MessageInput';
import TicTacToe from './game/TicTacToe';

class ChatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            activeChat: null,
            matching: false,
            finding: false,
            room: null,
            Player1: null,
        }
        this.resetChat = this.resetChat.bind(this)

    }

    setActiveChat = (activeChat) => {
        this.setState({ activeChat });
    }
    sendMessage = (chatId, message) => {
        const { socket } = this.props;
        console.log('chatId:', chatId);
        console.log('message:', message);

        socket.emit("MESSAGE_SENT", { chatId, message });
    }
    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props;
        socket.emit("TYPING", { chatId, isTyping });
    }
    resetChat = (chat) => {
        console.log("Rest Chat");

        return this.addChat(chat, true);
    }
    addChat = (chat, reset = false) => {
        const { socket } = this.props;
        const { chats } = this.state;

        console.log("state of Chats: ", this.state.chats);

        const newChats = reset ? [chat] : [...chats, chat];
        this.setState({ chats: newChats });
        console.log("state of Chats: ", this.state.chats);
        const messageEvent = "MESSAGE_RECIEVED-" + chat.id;
        socket.on(messageEvent, this.addMessageToChat(chat.id));



    }

    addMessageToChat = (chatId) => {
        return message => {
            const { chats } = this.state;
            console.log('chats:', chats);
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    chat.messages.push(message)
                return chat
            })
            this.setState({ chats: newChats })
            console.log("on listen to MESSAGE_RECIEVED: ", this.state.chats);

        }
    }
    componentDidMount() {
        const { socket } = this.props;
        this.initSocket(socket);
        // socket.emit("COMMUNITY_CHAT", this.resetChat)
    }
    initSocket(socket) {
        var { matching } = this.state;
        socket.emit("COMMUNITY_CHAT", this.resetChat)

        socket.on("PRIVATE_MESSAGE", this.addChat);
        socket.on("connect", () => {
            socket.emit("COMMUNITY_CHAT", this.resetChat)
        })
        socket.on("FIND_GAME", ({ newChat, room,Player1 }) => {
            console.log('room:', room)
            this.setState({ matching: true,finding:false, room: room,Player1:Player1 })
            this.setActiveChat(newChat);
            const { socket, user } = this.props;
            this.addChat(newChat);
        });
        // socket.emit("PRIVATE_MESSAGE",{reciever:"Baoit",sender: user.name})
    }
    findGame = (user) => {
        const { socket } = this.props;
        console.log('user:', user);
        socket.emit("FIND_GAME", { user });
        this.setState({finding:true});
    }
    sendOpenPrivateMessage = (reciever) => {
        console.log('reciever:', reciever);

        const { socket, user } = this.props;
        socket.emit("PRIVATE_MESSAGE", { reciever, sender: user.name });
    }
    exitRoom = ()=>{
        this.setState({matching: false});
    }
    render() {
        const { user, logout,socket } = this.props
        const { chats, activeChat, matching,Player1,room,finding } = this.state
        return (
            <div className="row h-100">
                <div className="col-4">
                    <SideBar
                    finding={finding}
                        logout={logout}
                        chats={chats}
                        socket={socket}
                        user={user}
                        activeChat={activeChat}
                        setActiveChat={this.setActiveChat}
                        onsendOpenPrivateMessage={this.sendOpenPrivateMessage}
                        findGame={this.findGame}
                        matching={matching}

                    />
                </div>
                <div className="chat-room-container col-8">
                    {
                        matching ? (<div className="chat-room"><TicTacToe id={room.id} exitRoom= {this.exitRoom} user={user} socket={socket} Player1={Player1} sendMessage={this.sendMessage} activeChat={activeChat} ></TicTacToe></div>) : (<div className="h-100">
                            {
                                (<div className="chat-room choose h-100 text-light">You are in Lobby! Click Find Game to Play Online</div>)
                                // activeChat !== null && !matching ? (<div className="chat-room">
                                //     {/* <ChatHeading name={activeChat.name} /> */}
                                //     {/* <Messages
                                //         messages={activeChat.messages}
                                //         user={user}
                                //         typingUsers={activeChat.typingUsers}
                                //     />
                                //     <MessageInput
                                //         sendMessage={
                                //             (message) => {
                                //                 this.sendMessage(activeChat.id, message);
                                //             }
                                //         }

                                //     /> */}
                                // </div>) : 

                            }
                        </div>)
                    }
                </div>
            </div>
        );
    }
}

export default ChatContainer;