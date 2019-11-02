import React, { Component } from 'react';

class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nickname: "",
            error: ""
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { socket } = this.props
        const { nickname } = this.state
        socket.emit("VERIFY_USER", nickname, this.setUser)
    }
    handleChange = (e) => {
        this.setState({ nickname: e.target.value })
    }
    setUser = ({ user, isUser }) => {
        console.log(user, isUser);
        if (isUser) {
            this.setError("User name taken");
        } else {
            this.props.setUser(user)
        }
    }
    setError = (error) => {
        this.setState({ error });
    }

    render() {
        const { nickname, error } = this.state;
        return (
            <div className="login">
                <form onSubmit={this.handleSubmit} className="login-form">
                    <label className="text-primary" htmlFor="nickname">
                        <h2>Got a Nick Name</h2>

                    </label>
                    <input
                    className="form-control"
                        ref={(input) => {
                            this.textInput = input
                        }}
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={this.handleChange}
                        placeholder={'Baoit128'}
                    />
                    <div className="error">{error ? error : null}</div>
                </form>
            </div>
        );
    }
}

export default LoginForm;