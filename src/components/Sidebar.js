import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import { FaChevronCircleDown } from 'react-icons/fa';
import { FaAlignJustify } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { MdEject } from 'react-icons/md';
import 'bootstrap/dist/css/bootstrap.css';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reciever: "",
            finding: false,
        }

    }
    componentDidMount() {

    }
    init(socket) {

    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { reciever } = this.state;
        const { onsendOpenPrivateMessage } = this.props;
        onsendOpenPrivateMessage(reciever);


    }
    handleChange = (e) => {
        this.setState({ reciever: e.target.value })
    }
    onFindGame = (e) => {
        const { findGame, user } = this.props;
        this.setState({ finding: true })
        findGame(user);
    }
    render() {
        const { chats, activeChat, user, setActiveChat, logout, matching } = this.props;
        const { finding } = this.state;
        return (
            <div id="side-bar">
                <div className="heading">
                    <div className="app-name">Our Cool Chat <FaChevronCircleDown /></div>
                    <div className="menu">
                        <FaAlignJustify />
                    </div>
                    {
                        !matching ? (<div>

                            {finding ? <Spinner animation="grow" variant="primary" /> : <Button variant="primary" onClick={this.onFindGame} size="lg">
                                Find Game
                            </Button>

                            }
                        </div>) : null
                    }

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
                            console.log(chat);
                            if (chat.name) {
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                var chatSideBarName = "Community";

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