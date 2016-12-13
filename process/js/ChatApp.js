import React from 'react';
import ReactDOM from 'react-dom';

class ChatApp extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {socket: io(), messages: ['test messages'], usersTyping: []};
        console.log(this.state.socket);

        this.onConnect();
        this.onDisconnect();
    }

    /* On connect, emit connection to other users. */
    onConnect()
    {
        let socket = this.state.socket;
        socket.on('connect', () =>
        {
            // console.log(socket.id);
            socket.emit('userConnected', {userID: socket.id});
        });
    }

    /* On disconnect, emit disconnection to other users. */
    onDisconnect()
    {
        let socket = this.state.socket;
        socket.on('disconnect', () =>
        {
            /* Let others know that you are not typing anymore. */
            socket.emit('userTyping', {typing: false});

            /* Let others know you went offline */

        });
    }

    /* Runs when component has been rendered to DOM. */
    componentDidMount()
    {
        console.log('did mount');

        let socket = this.state.socket,
            chatMessages = document.getElementById('chatMessages'),
            message = document.getElementById('message');

        /* Make sure there is a socket in the state. */
        if (socket)
        {
            /* Get the chat form */
            var chatForm = document.forms.chatForm;

            if (chatForm)
            {
                this.initEventListeners(socket, chatMessages, message);
                this.initSocketOn(socket, chatMessages, message);
            }
        }
    }

    /* Add event listeners for typing and sending messages */
    initEventListeners(socket, chatMessages, message)
    {
        /* When user is typing, emit typing to server. */
        message.addEventListener('input', (e) =>
        {
            let typing = message.value ? true : false;

            /* Tell other users that this user is typing or not typing. */
            socket.emit('userTyping', {username: 'TempUsername', typing: typing});
        });

        /* On form submit, emit post message to server. */
        chatForm.addEventListener('submit', (e) =>
        {
            e.preventDefault();

            /* Sends message to server for it to emit and then refocuses on input. */
            socket.emit('sendMessage', {message: message.value});
            message.value = '';
            message.focus();
        });
    }

    /* Listen for emittions from server for incoming messages. */
    initSocketOn(socket, chatMessages, message)
    {
        /* Update messages in chat box. */
        socket.on('updateMessages', (data) => {this.onUpdateMessages(data);});

        /* When another user is online, tell user */
        socket.on('userConnected', (data) => {this.onUserConnected(data);});

        /* When another user went offline, tell user */
        socket.on('userDisconnected', (data) => {this.onUserDisconnected(data);});

        /* When another user is typing, tell user */
        socket.on('userTyping', (data) => {this.onUserTyping(data);});
    }

    /* ----------------------On socket methods-------------------- */

    onUpdateMessages(data)
    {
        let messages = this.state.messages;
        messages.push(data.message);
        console.log(data);
        console.log(messages);
        
        this.setState({messages: messages});
    }

    onUserConnected(data)
    {
        console.log(data.userID + ' connected');
    }

    onUserDisconnected(data)
    {
        console.log(data);
    }

    onUserTyping(data)
    {
        console.log(data.typing + ' user typing');
        let usersTyping = this.state.usersTyping;
        let index = usersTyping.indexOf(data.username);
        console.log('index: ' + index);

        /* Make sure a username has been passed through. */
        if (data.username)
        {

            /* Make sure the user is not already typing. */
            if (index === -1 && data.typing)
                /* Add user to the list. */
                usersTyping.push(data.username);
            
            /* Otherwise, remove the name from the list. */
            else if (index !== -1 && !data.typing)
                usersTyping.splice(index, 1);
            else
                console.log(data.username + ' is already not typing.');
        }

        /* Rerender the users typing. */
        this.setState({usersTyping: usersTyping});
    }

    /* ------------------End on socket methods-------------------- */

    convertMessages(e, i)
    {
        return (
            <div key={i}>{e}</div>
        );
    }

    render()
    {
        let messages = this.state.messages.map(this.convertMessages);
        let usersTyping = this.state.usersTyping.join(',');
        console.log(this.state.usersTyping);
        usersTyping += usersTyping ? ' is typing...' : '';

        return (
            <div className="center-block">
                <div id="chatMessages">
                    {messages}
                    <span className="typing">{usersTyping}</span>
                </div>
                <form name="chatForm">
                    <div className="form-group">
                        <input type="text" id="message" className="form-control" required></input>
                        <button type="submit" className="btn btn-primary">Send</button>
                    </div>
                </form>
            </div>
        );
    }
}

ReactDOM.render(<ChatApp/>, document.getElementById('chatApp'));