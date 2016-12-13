import React from 'react';
import ReactDOM from 'react-dom';

class ChatApp extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {socket: io(), messages: ['test messages']};
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
            socket.emit('userConnected', {user:socket.id});
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
            /* Make sure message is not empty. */
            if (message.value)
            {
                /* Tell other users that this user is typing. */
                socket.emit('userTyping', {typing: true});
            } else
            {
                /* Tell other users that this user is not typing. */
                socket.emit('userTyping', {typing: false});
            }
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
        socket.on('updateMessages', (data) =>
        {
            let messages = this.state.messages;
            messages.push(data.message);
            console.log(data);
            console.log(messages);
            
            this.setState({messages: messages});
        });

        /* When another user is online, tell user */
        socket.on('userConnected', (data) =>
        {
            console.log(data.user + ' connected');
        });

        /* When another user went offline, tell user */
        socket.on('userDisconnected', (data) =>
        {
            console.log(data);
        });

        /* When another user is typing, tell user */
        socket.on('userTyping', (data) =>
        {
            console.log(data.typing);
        });
    }

    convertMessages(e, i)
    {
        return (
            <div key={i}>{e}</div>
        );
    }

    render()
    {
        let messages = this.state.messages.map(this.convertMessages);

        return (
            <div className="center-block">
                <div id="chatMessages">{messages}</div>
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