import React from 'react';
import ReactDOM from 'react-dom';

class ChatApp extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            socket: io(), 
            messages: [/*{username: 'TempUsername', message: 'test messages'}*/],
            users: [/*'TempUsername'*/],
            usersTyping: [],
            username: ''
        };

        this.onConnect();
        this.onDisconnect();
    }

    /* On connect, emit connection to other users. */
    onConnect()
    {
        let socket = this.state.socket;
        socket.on('connect', () =>
        {
            socket.emit('userConnected', {userID: socket.id});
        });
    }

    /* On disconnect, emit disconnection to other users. */
    onDisconnect()
    {
        let socket = this.state.socket;
        let users = this.state.users;
        let username = this.state.username;
        socket.on('disconnect', () =>
        {
            
        });
    }

    componentWillUnmount()
    {
        console.log('will unmount');
        let socket = this.state.socket;
        let username = this.state.username;

        /* Tell everyone you left. */
        // socket.emit('onUserDisconnected', {username: username});
    }

    /* Runs when component has been rendered to DOM. */
    componentDidMount()
    {
        console.log('did mount');

        let socket = this.state.socket,
            chatMessages = document.getElementById('chatMessages'),
            messageInput = document.getElementById('message'),
            usernameInput = document.getElementById('username');

        /* Make sure there is a socket in the state. */
        if (socket)
        {
            /* Get the chat and username forms. */
            let chatForm = document.forms.chatForm,
                usernameForm = document.forms.usernameForm;

            if (chatForm && usernameForm)
            {
                this.initEventListeners(socket, chatForm, usernameForm, chatMessages, messageInput);
                this.initSocketOn(socket, chatMessages, message);
            }
        }

        window.onbeforeunload = () => 
        {
            let username = this.state.username;
            socket.emit('onUserDisconnected', {username: username});
        }
    }

    /* Add event listeners for typing and sending messages */
    initEventListeners(socket, chatForm, usernameForm, chatMessages, messageInput)
    {
        /* When user is typing, emit typing to server. */
        messageInput.addEventListener('input', (e) =>
        {
            let typing = messageInput.value ? true : false;
            let username = this.state.username;
            console.log(username);
            if (username)
            {
                /* Tell other users that this user is typing or not typing. */
                socket.emit('userTyping', {username: username, typing: typing});
            } else
            {
                /* Username has not been set yet. */
            }
        });

        /* On username form submit, emit user connected to others */
        usernameForm.addEventListener('submit', (e) =>
        {
            e.preventDefault();

            let username = usernameForm.username.value;
            console.log(username);
            if (username)
            {

                /* If username is not taken */
                if (this.state.users.indexOf(username) == -1)
                {
                    this.setState({username: username});
                    socket.emit('userConnected', {username: username});

                    /* Remove this form and input. Do not allow user to change usernames. */

                } 

                /* If username is taken */
                else
                {
                    alert('username is taken');
                }
            }
        });

        /* On chat form submit, emit post message to others. */
        chatForm.addEventListener('submit', (e) =>
        {
            e.preventDefault();
            let messageInput = chatForm.message;
            let username = this.state.username;

            /**/
            if (username)
            {
                /* Sends message to server for it to emit and then refocuses on input. */
                socket.emit('sendMessage', {message: {username: username, message: messageInput.value}});
                messageInput.value = '';
                messageInput.focus();
                socket.emit('userTyping', {username: username, typing: false});
            } else
            {
                alert('Please set a username first.');
            }
        });
    }

    /* Listen for emittions from server for incoming inquiries. */
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
        
        this.setState({messages: messages});
    }

    onUserConnected(data)
    {
        console.log(data.username + ' connected');

        /* Add to sidebar list. */
        let users = this.state.users;
        let messages = this.state.messages;

        /* Make sure username has been passed through*/
        if (data.username)
        {
            users.unshift(data.username);
            messages.push({message: data.username + ' joined the chat room.'});
        }


        /* Rerender the list of users in the chat. */
        this.setState({users: users});
    }

    onUserDisconnected(data)
    {
        console.log(data);

        let socket = this.state.socket;
        let users = this.state.users;
        let username = data.username;

        /* Let others know that you are not typing anymore. */
        socket.emit('userTyping', {username: username, typing: false});

        /* Let others know you went offline */
        socket.emit('sendMessage', {message: username + ' left the chat room.'});

        /* Remove user from the list of users. */
        users.splice(username);
        this.setState({users: users});
    }

    onUserTyping(data)
    {
        console.log(data.typing + ' user typing');
        let usersTyping = this.state.usersTyping;
        let index = usersTyping.indexOf(data.username);

        /* Make sure a username has been passed through. */
        if (data.username)
        {

            /* Make sure the user is not already typing. */
            if (index === -1 && data.typing)
                /* Add user to the list of users typing. */
                usersTyping.push(data.username);
            
            /* Make sure user is not typing and is in the list of users typing. */
            else if (index !== -1 && !data.typing)
                /* Remove the name from the list of users typing. */
                usersTyping.splice(index, 1);
            
            /* User is currently typing. */
            else if (index !== -1 && data.typing)
                console.log(data.username + ' is typing');

            /* Error: user is not typing. */
            else
                console.log(data.username + ' is already not typing.');
        }

        /* Rerender the users typing. */
        this.setState({usersTyping: usersTyping});
    }

    /* ------------------End on socket methods-------------------- */

    /* Converts the message to JSX HTML component. */
    convertMessages(e, i)
    {
        let message = (
            <div key={i} className={e.username === this.state.username ? 'bg-info' : ''}>
                {
                    e.username &&
                    <div className="username">
                        <b>{e.username}</b>
                    </div>
                }
                {e.message}
            </div>
        );

        return message;
    }

    /* Converts the user to JSX HTML component. */
    convertUsers(e, i)
    {
        let user = (
            <li key={i} className="">
                {e}
            </li>
        );

        return user;
    }

    render()
    {
        let messages = this.state.messages.map(this.convertMessages, this);
        let users = this.state.users.map(this.convertUsers);
        let usersTyping = this.state.usersTyping.join(',');
        usersTyping += usersTyping ? ' is typing...' : '';

        return (
            <div className="">
                <div className="text-center">
                    <h1>OP CHAT</h1>
                </div>
                <div className="chat-app container center-block">
                    <div className="row">
                        <div className="col-sm-3 nopad">
                            <div id="chatUsers" className="container-fluid">
                                <h3>Users in chat room</h3>
                                <ul className="userList">{users}</ul>
                            </div>
                            <form name="usernameForm">
                                <input type="text" id="username" name="username" className="form-control" placeholder="Enter name" required></input>
                                <button type="submit" className="btn btn-success">Go</button>
                            </form>
                        </div>
                        <div className="col-sm-9 nopad">
                            <div id="chatMessages">
                                {messages}
                                <span className="typing">{usersTyping}</span>
                            </div>
                            <form name="chatForm">
                                <div className="form-group row nopad">
                                    <div className="col-sm-10 nopad">
                                    <input type="text" id="message" className="form-control" required></input>
                                    </div>
                                    <div className="col-sm-2 nopad">
                                    <button type="submit" className="form-control btn btn-primary">Send</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<ChatApp/>, document.getElementById('chatApp'));