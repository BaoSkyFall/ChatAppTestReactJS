import React, { Component } from 'react';
import io from 'socket.io-client';
import LoginForm from './LoginForm';
import ChatContainer from './ChatContainer';
import styles from './Layout.css';

const socketUrl = "http://localhost:3000"
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            user: null,
        }
    }
    componentWillMount() {
        this.initSocket();
    }
    initSocket = () => {
        const socket = io(socketUrl);
        socket.on('connect', () => {
            console.log("Connected!!");
        })
        this.setState({ socket });
    }
    setUser = (user) => {
        const { socket } = this.state;
        socket.emit("USER_CONNECTED", user);
        console.log("User Connected: ", user);
        this.setState({ user });
    }
    logout = () => {
        const { socket } = this.state;
        socket.emit('LOGOUT')
        this.setState({ user: null });
    }
    
    render() {
        const { title } = this.props;
        const { socket, user,matching } = this.state;
        return (
            user ? <div className="h-100">
                <ChatContainer user={user} socket={socket}  logout={this.logout} />
            </div> :
                <div className="container">
                    <LoginForm socket={socket} setUser={this.setUser} />
                </div>
        );
    }
}

export default Layout;