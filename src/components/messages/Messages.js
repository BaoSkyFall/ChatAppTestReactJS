import React, { Component } from 'react';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.scrollDown = this.scrollDown.bind(this);
        this.state = {

        }
    }


    /*
    *	Scrolls down the view of the messages.
    */
    scrollDown() {
        const { container } = this.refs
        container.scrollTop = container.scrollHeight
    }

    componentDidUpdate(newProps) {
        this.scrollDown();

    }

    componentDidMount() {
        this.scrollDown();
    }
    render() {
        if (this.props.messages) {
            const { messages, user, typingUsers } = this.props;
            console.log(messages.length);
            return (
                <div ref='container'
                    className="thread-container">
                    <div className="thread">
                        {

                            messages.length > 0 ? messages.map((mes, i) => {

                                return (
                                    <div key={mes.id} className={`message-container ${mes.sender === user.name && 'right'}`}>
                                        <div className="time">{mes.time}
                                            <h4>{mes.sender}</h4></div>


                                        <div className="data">

                                            <div className="message">{mes.message}</div>
                                        </div>
                                    </div>)
                            }) : (<div>Lobby</div>)

                        }
                        {/* {
                             messages.length>0 ?typingUsers.map((name) => {
                                return (
                                    <div key={name} className="typing-user">
                                        {`${name} is typing . . .`}
                                    </div>
                                )
                            }): (<div></div>)
                        } */}

                    </div>
                </div>
            );
        }

    }
}

export default Messages;