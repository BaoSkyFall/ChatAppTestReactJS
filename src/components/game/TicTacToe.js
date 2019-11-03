import React from 'react';
import './TicTacToe.css';
import Button from 'react-bootstrap/Button';
import Messages from '../messages/Messages';
import MessageInput from '../messages/MessageInput';
import Swal from 'sweetalert2';
class Square extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        // console.log('key:', key)
        // console.log('id:', id)
        return (
            <button className="square" onClick={() => this.props.onClick()}>{this.props.value}</button>
        )
    }
}

class TicTacToe extends React.Component {
    constructor(props) {
        super(props);
        this.location = [];
        this.index = 0;
        this.active = '';
        this.reverse = false;
        this.state = {
            squares: Array(400).fill(null),
            turn: null,
            Player1: true,
            isFinish: false,
            isWinP1: false,
            reeverse: false,
            activeIndex: -1
        };
        this.returning = false;
    }

    onClickChoose(i) {
        if (!this.state.isFinish) // Kiểm tra kết thúc ván đấu
        {
            if (this.state.squares[i] === null) // Kiểm tra xem đã đánh chưa
            {
                if (this.state.turn) {
                    const { socket, id } = this.props;
                    var squares = this.state.squares.slice();
                    console.log(i);
                    console.log(squares);
                    console.log(this.location);
                    if (this.state.Player1) {
                        squares[i] = 'X';
                    }
                    else {
                        squares[i] = 'O';
                    }

                    this.setState({
                        squares: squares,
                        turn: false,
                        activeIndex: -1,
                    }, () => {
                        if (ruleToWin(this.state.squares, i) === true) {
                            if (this.state.Player1) {
                                this.setState({
                                    isFinish: true,
                                    isWinP1: true,
                                })
                                setTimeout(() => {
                                    Swal.fire({
                                        title: 'CONGRATULATION !!!, YOU WIN !!!',
                                        width: 600,
                                        buttons: "Play Again",
                                        padding: '3em',
                                        background: '#fff url()',
                                        backdrop: `
                                          rgba(245,0,0,0.5)
                                          url("https://media.giphy.com/media/2gtoSIzdrSMFO/giphy.gif")
                                          center
                                          no-repeat
                                        `
                                    })
                                    // this.onPlayAgainClick();
                                }, 100)



                            }


                            else {
                                this.setState({
                                    isFinish: true,
                                    isWinP1: false,
                                })
                                setTimeout(() => {
                                    alert('Player X Win !!!');
                                    Swal.fire({
                                        title: 'CONGRATULATION !!!, YOU WIN !!!',
                                        width: 600,
                                        padding: '3em',
                                        background: '#fff url()',
                                        backdrop: `
                                          rgba(245,0,0,0.5)
                                          url("https://media.giphy.com/media/2gtoSIzdrSMFO/giphy.gif")
                                          center
                                          no-repeat
                                        `
                                    })
                                    this.onPlayAgainClick();

                                }, 100)

                            }

                        }
                        const { Player1 } = this.state;
                        var isFinish_temp = ruleToWin(squares, i) ? true : false;
                        var isWinP1_temp = this.state.Player1 ? true : false;
                        if (isFinish_temp) {
                            squares = new Array(400).fill(null);
                        }
                        console.log('isFinish_temp:', isFinish_temp);
                        console.log('isWinP1_temp:', isWinP1_temp);
                        socket.emit("CHECK_SQUARE_CLICK", { squares, isFinish_temp, isWinP1_temp, Player1, id });

                    })



                }


            }
        }
        else {

        }

    }

    componentDidMount() {
        const { socket } = this.props;
        this.initSocket(socket);
    }
    initSocket(socket) {
        const { Player1 } = this.props;
        this.setState({ Player1 });
        socket.on("SEND_PLAYER", ({ Player1 }) => {
            console.log("socket on Send_Player work");
            this.setState({
                turn: Player1,
                Player1: Player1,
            })
        })
        socket.on("CHECK_SQUARE_CLICK", (room) => {
            console.log('room:', room)
            this.setState({
                squares: room.squares,
                isFinish: room.isFinish,
                isWinP1: room.isWinP1,
                turn: true
            }, () => {
                if (this.state.isFinish) {
                    Swal.fire({
                        title: 'YOU LOSE !!!',
                        width: 600,
                        buttons: "Play Again",
                        padding: '3em',
                        background: '#fff url()',
                        backdrop: `
                          rgba(0,0,0,0.4)
                          url("https://media.giphy.com/media/d1G6qsjTJcHYhzxu/giphy.gif")
                          center top
                          no-repeat
                        `
                    })
                }
            })

            // socket.emit("PRIVATE_MESSAGE",{reciever:"Baoit",sender: user.name})
        })

    }
    onPlayAgainClick() {
        this.setState({
            squares: Array(400).fill(null),
            turn: true,
            isFinish: false,
            isWinP1: false,
        })
    }
    onchangeTurn(value, i) {
        console.log(i);

        this.state.squares = value;
        this.index = i;
        this.returning = true;
        this.state.activeIndex = i;

        console.log(this.state.activeIndex);
        this.setState({
            squares: value,
            turn: i % 2 == 0 ? true : false,

        })
    }
    onReverse() {
        this.reverse = !this.reverse;
        this.setState({ reverse: !this.state.reverse });


    }
    createTable = () => {
        let table = []

        // Outer loop to create parent
        for (let i = 0; i < 20; i++) {
            let arr_child = []
            //Inner loop to create arr_child
            for (let j = 0; j < 20; j++) {
                let temp_key = 20 * i + j
                // console.log('temp_key:', temp_key)
                if (this.state.squares[20 * i + j] !== null) {
                    arr_child.push(<Square key={temp_key} id={temp_key} onClick={() => {
                        this.onClickChoose(temp_key)
                        // if (this.returning) {
                        //     this.location.splice(this.index, this.location.length - this.index);
                        //     this.returning = false;
                        // }
                        // if (this.state.squares[temp_key] === null) {
                        //     this.location.push({
                        //         x: i,
                        //         y: j,
                        //         player: this.state.turn ? 'Player 1' : 'Player 2',
                        //         squares: this.state.squares
                        //     })
                        // }


                    }} value={this.state.squares[temp_key]} />)
                }
                else {
                    arr_child.push(<Square key={temp_key} onClick={() => {
                        this.onClickChoose(temp_key)
                        // if (this.returning) {
                        //     this.location.splice(this.index, this.location.length - this.index);
                        //     this.returning = false;
                        // }
                        // if (this.state.squares[temp_key] === null) {
                        //     this.location.push({
                        //         x: i,
                        //         y: j,
                        //         player: this.state.turn ? 'Player 1' : 'Player 2',
                        //         squares: this.state.squares

                        //     })
                        // }


                    }} value={'\u00A0'} />)
                }
            }
            // console.log(arr_child);
            //Create the parent and add the arr_child
            table.push(<div className="board-row" key={i}>{arr_child}</div>)
        }
        return table
    }
    sendMes = (id, mess) => {
        const { sendMessage } = this.props;
        console.log('id:', id);
        console.log('mess:', mess)
        sendMessage(id, mess);
    }
    onSurrender = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will lose this game!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'YOU LOSE !!!',
                    width: 600,
                    buttons: "Play Again",
                    padding: '3em',
                    background: '#fff url()',
                    backdrop: `
                      rgba(0,0,0,0.4)
                      url("https://media.giphy.com/media/d1G6qsjTJcHYhzxu/giphy.gif")
                      center top
                      no-repeat
                    `
                })
            }
        })
    }
    render() {
        let status;
        const { user, activeChat } = this.props;




        return (
            <div className="container">

                <div className="row d-flex justify-content-center w-100">

                    <div className="col-6">
                        <div className="board">
                            {this.createTable()}

                        </div>
                        <div className="mt-2">
                            <Button variant="success" block
                            >Make Request Play Back Step</Button>
                            <Button onClick={this.onSurrender} variant="danger" block
                            >Surrender</Button>
                            {/* <button className="btn btn-success" onClick={() => this.onReverse()}>Reverse {this.state.reverse ? 'DESC' : 'ASC'}</button>
                            <div>
                                {

                                    this.state.reverse ? this.location.reverse().map((el, i) => <div><div className={`btn btn-primary ${this.state.activeIndex == i ? 'active' : ''}`} onClick={() => this.onchangeTurn(el.squares, i)}>Turn: {this.location.length - i} - {el.player} X : {el.x} and Y : {el.y}</div>
                                        <div className={`btn btn-danger ${this.state.activeIndex == i ? 'active' : ''}`}>({el.x}, {el.y})</div></div>) : this.location.map((el, i) => <div><div className={`btn btn-primary ${this.state.activeIndex == i ? 'active' : ''}`} onClick={() => this.onchangeTurn(el.squares, i)}>Turn: {i + 1} - {el.player} X : {el.x} and Y : {el.y}</div>
                                            <div className={`btn btn-danger ${this.state.activeIndex == i ? 'active' : ''}`}>({el.x}, {el.y})</div></div>)
                                }
                            </div>
                            <button className="btn-lg btn-primary my-2 font-weight-bold" onClick={() => this.onPlayAgainClick()}>Play Again</button> */}
                        </div>

                    </div>
                    {activeChat ? (<div className="col-6">
                        <h3 className="text-primary"
                        >Chat Conversation</h3>

                        <Messages
                            messages={activeChat.messages}
                            user={user}
                            typingUsers={activeChat.typingUsers}
                        />
                        <MessageInput
                            sendMessage={
                                (message) => {
                                    this.sendMes(activeChat.id, message);
                                }
                            }

                        />
                    </div>) : null}


                </div>
            </div>
        );
    }
}

function ruleToWin(squares, i) {
    // Kiểm tra hàng dọc    
    let chessNum = 1;
    let TwoSideChecked = 0;
    for (let j = 1; j < 5; j++) {
        if (i - j * 20 >= 0) {
            if (squares[i] === squares[i - j * 20]) {
                chessNum++;
                if (chessNum === 5) {
                    if (
                        (i - 5 * 20 < 0 || (squares[i - 5 * 20] !== squares[i] && squares[i - 5 * 20] !== null))
                        && (i + 20 >= 400 || (squares[i + 20] !== squares[i] && squares[i + 20] !== null))
                    ) {
                        return false;
                    }

                    return true;
                }
            }
            else if (squares[i - j * 20] !== null) {
                TwoSideChecked++;
                break;
            }
            else {
                break;
            }
        }
        else {
            TwoSideChecked++;
            break;
        }
    }
    for (let j = 1; j < 5; j++) {
        if (i + j * 20 < 400 && squares[i] === squares[i + j * 20]) {
            chessNum++;
            if (chessNum === 5) {
                if (i + (j + 1) * 20 >= 400 || (squares[i + (j + 1) * 20] !== squares[i] && squares[i + (j + 1) * 20] !== null)) {
                    if (TwoSideChecked === 1) {
                        return false;
                    }
                }

                return true;
            }
        }
        else {
            break;
        }
    }

    // Kiểm tra hàng ngang
    chessNum = 1;
    TwoSideChecked = 0;
    for (let j = 1; j < 5; j++) {
        if (i % 20 - j >= 0) {
            if (squares[i] === squares[i - j]) {
                chessNum++;
                if (chessNum === 5) {
                    if (
                        (i % 20 - 5 < 0 || (squares[i - 5] !== squares[i] && squares[i - 5] !== null))
                        && (i % 20 + 1 >= 20 || (squares[i + 1] !== squares[i] && squares[i + 1] !== null))
                    ) {
                        return false;
                    }
                    return true;
                }
            }
            else if (squares[i - j] !== null) {
                TwoSideChecked++;
                break;
            }
            else {
                break;
            }
        }
        else {
            TwoSideChecked++;
            break;
        }
    }
    for (let j = 1; j < 5; j++) {
        if (i % 20 + j < 20 && squares[i] === squares[i + j]) {
            chessNum++;
            if (chessNum === 5) {
                if (i % 20 + j + 1 >= 20 || (squares[i + j + 1] !== squares[i] && squares[i + j + 1] !== null)) {
                    if (TwoSideChecked === 1) {
                        return false;
                    }
                }

                return true;
            }
        }
        else {
            break;
        }
    }

    // Kiểm tra chéo trái
    chessNum = 1;
    TwoSideChecked = 0;
    for (let j = 1; j < 5; j++) {
        if (i % 20 - j >= 0 && i - j - j * 20 >= 0) {
            if (squares[i] === squares[i - j - j * 20]) {
                chessNum++;
                if (chessNum === 5) {
                    if (
                        (i % 20 - 5 < 0 || i - 5 * 20 < 0 || (squares[i - 5 - 5 * 20] !== squares[i] && squares[i - 5 - 5 * 20] !== null))
                        && (i % 20 + 1 >= 20 || i + 20 >= 400 || (squares[i + 1 + 20] !== squares[i] && squares[i + 1 + 20] !== null))
                    ) {
                        return false;
                    }
                    return true;
                }
            }
            else if (squares[i - j - j * 20] !== null) {
                TwoSideChecked++;
                break;
            }
            else {
                break;
            }
        }
        else {
            TwoSideChecked++;
            break;
        }
    }
    for (let j = 1; j < 5; j++) {
        if (i % 20 + j < 20 && i + j + j * 20 < 400 && squares[i] === squares[i + j + j * 20]) {
            chessNum++;
            if (chessNum === 5) {
                if (i % 20 + j + 1 >= 20 || i + (j + 1) * 20 >= 400
                    || (squares[i + j + 1 + (j + 1) * 20] !== squares[i] && squares[i + j + 1 + (j + 1) * 20] !== null)) {
                    if (TwoSideChecked === 1) {
                        return false;
                    }
                }

                return true;
            }
        }
        else {
            break;
        }
    }

    // Kiểm tra chéo phải
    chessNum = 1;
    TwoSideChecked = 0;
    for (let j = 1; j < 5; j++) {
        if (i % 20 + j < 20 && i + j - j * 20 >= 0) {
            if (squares[i] === squares[i + j - j * 20]) {
                chessNum++;
                if (chessNum === 5) {
                    if (
                        (i % 20 + 5 >= 20 || i - 5 * 20 < 0 || (squares[i + 5 - 5 * 20] !== squares[i] && squares[i + 5 - 5 * 20] !== null))
                        && (i % 20 - 1 < 0 || i + 20 >= 400 || (squares[i - 1 + 20] !== squares[i] && squares[i - 1 + 20] !== null))
                    ) {
                        return false;
                    }
                    return true;
                }
            }
            else if (squares[i + j - j * 20] !== null) {
                TwoSideChecked++;
                break;
            }
            else {
                break;
            }
        }
        else {
            TwoSideChecked++;
            break;
        }
    }
    for (let j = 1; j < 5; j++) {
        if (i % 20 - j >= 0 && i - j + j * 20 < 400 && squares[i] === squares[i - j + j * 20]) {
            chessNum++;
            if (chessNum === 5) {
                if (i % 20 - j - 1 < 0 || i + (j + 1) * 20 >= 400
                    || (squares[i - (j + 1) + (j + 1) * 20] !== squares[i] && squares[i - (j + 1) + (j + 1) * 20] !== null)) {
                    if (TwoSideChecked === 1) {
                        return false;
                    }
                }

                return true;
            }
        }
        else {
            break;
        }
    }

    return false;
}

export default TicTacToe    