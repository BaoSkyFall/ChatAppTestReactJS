import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { FaChevronCircleDown } from 'react-icons/fa';
import { FaAlignJustify } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { MdEject } from 'react-icons/md';
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reciever: ""
        }

    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { reciever } = this.state;
        const { user, chats, onsendOpenPrivateMessage } = this.props;

        console.log(reciever);
        console.log(user);
        console.log(chats);
        onsendOpenPrivateMessage(reciever);


    }
    handleChange = (e) => {
        this.setState({ reciever: e.target.value })
    }
    onFindGame = (e) => {
        const  { findGame, user } = this.props;
        findGame(user);
    }
    render() {
        const { chats, activeChat, user, setActiveChat, logout, findGame } = this.props;
        return (
            <div id="side-bar">
                <div className="heading">
                    <div className="app-name">Our Cool Chat <FaChevronCircleDown /></div>
                    <div className="menu">
                        <FaAlignJustify />
                    </div>
                    <Button variant="primary" onClick={this.onFindGame} size="lg">
                        Find Game
                 </Button>
                </div>
                <form onSubmit={this.handleSubmit} className="search">
                    <i className="search-icon"><FaSearch /></i>
                    <input placeholder="Search" type="text"
                        onChange={this.handleChange}
                    />
                    <div className="plus"></div>
                </form>
                <div
                    className="users"
                    ref='users'
                    onClick={(e) => { (e.target === this.refs.user) && setActiveChat(null) }}>

                    {
                        chats.map((chat) => {
                            if (chat.name) {
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                const chatSideBarName = chat.users.find((name) => {
                                    return name !== user.name
                                }) || "Community"
                                const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ''

                                return (
                                    <div
                                        key={chat.id}
                                        className={`user ${classNames}`}
                                        onClick={() => { setActiveChat(chat) }}
                                    >
                                        <div className="user-photo">{chatSideBarName[0].toUpperCase()}</div>
                                        <div className="user-info">
                                            <div className="name">{chatSideBarName}</div>
                                            {lastMessage && <div className="last-message">{lastMessage.message}</div>}
                                        </div>

                                    </div>
                                )
                            }

                            return null
                        })
                    }

                </div>
                <div className="current-user">
                    <span>{user.name}</span>
                    <div onClick={() => { logout() }} title="Logout" className="logout">
                        <MdEject />
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;