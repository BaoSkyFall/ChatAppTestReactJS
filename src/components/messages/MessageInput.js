import React, { Component } from 'react';

class MessageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isTyping: false
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.sendMessage();
        this.setState({ message: "" });

    }
    sendMessage = () => {
        console.log(this.state.message);
        this.props.sendMessage(this.state.message);
    }
    sendTyping = () => {
        this.props.sendTyping(this.state.isTyping);
    }
    // const {}
    render() {
        const { message } = this.state;
        return (
            <div className="message-input">
                <form
                    onSubmit={this.handleSubmit}
                    className="message-form">
                    <input
                        id="message"
                        ref={"messageinput"}
                        type="text"
                        className="form-control"
                        value={message}
                        autoComple={'off'}
                        placeholder="You wana send something?"
                        onKeyUp={e => {
                            e.keyCode != 13 && this.sendTyping()
                        }}
                        onChange={
                            ({ target: { value: v } }) => {
                                this.setState({ message: v })
                            }
                        }
                    />
                    <button disabled={message.length < 1} className=" send"
                        type="submit"
                    >Send
                    </button>
                </form>
            </div>
        );
    }
}

export default MessageInput;