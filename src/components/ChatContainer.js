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
            matching: false
        }
        this.resetChat = this.resetChat.bind(this)

    }

    setActiveChat = (activeChat) => {
        this.setState({ activeChat });
    }
    sendMessage = (chatId, message) => {
        const { socket } = this.props;
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
        const newChats = reset ? [chat] : [...chats, chat];
        this.setState({ chats: newChats });
        const messageEvent = "MESSAGE_RECIEVED-" + chat.id;
        socket.on(messageEvent, this.addMessageToChat(chat.id));



    }

    addMessageToChat = (chatId) => {
        return message => {
            const { chats } = this.state;
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    chat.messages.push(message)
                return chat
            })
            this.setState({ chats: newChats })

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
        socket.on("FIND_GAME", () => {
            this.setState({ matching: true })
            console.log('matching:', this.state.matching);
        });
        // socket.emit("PRIVATE_MESSAGE",{reciever:"Baoit",sender: user.name})
    }
    findGame = (user) => {
        const { socket } = this.props;
        console.log('user:', user);
        socket.emit("FIND_GAME", { user });
    }
    sendOpenPrivateMessage = (reciever) => {
        console.log('reciever:', reciever);

        const { socket, user } = this.props;
        socket.emit("PRIVATE_MESSAGE", { reciever, sender: user.name });
    }
    render() {
        const { user, logout } = this.props
        const { chats, activeChat, matching } = this.state
        return (
            <div className="container">
                <SideBar
                    logout={logout}
                    chats={chats}
                    user={user}
                    activeChat={activeChat}
                    setActiveChat={this.setActiveChat}
                    onsendOpenPrivateMessage={this.sendOpenPrivateMessage}
                    findGame={this.findGame}
                    matching={matching}
                />
                <div className="chat-room-container">
                    {
                        matching ? (<div className="chat-room"><TicTacToe></TicTacToe></div>) : (<div>
                            {
                                activeChat !== null && !matching ? (<div className="chat-room">
                                    <ChatHeading name={activeChat.name} />
                                    <Messages
                                        messages={activeChat.messages}
                                        user={user}
                                        typingUsers={activeChat.typingUsers}
                                    />
                                    <MessageInput
                                        sendMessage={
                                            (message) => {
                                                this.sendMessage(activeChat.id, message);
                                            }
                                        }
                                        sendTyping={
                                            (isTyping) => {
                                                this.sendTyping(activeChat.id, isTyping);
                                            }
                                        }
                                    />
                                </div>) : (<div className="chat-room choose">You are in!</div>)

                            }
                        </div>)
                    }
                </div>
            </div>
        );
    }
}

export default ChatContainer;