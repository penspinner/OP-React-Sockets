import React from 'react';
import ReactDOM from 'react-dom';

import SideBar from './SideBar';
import ChatBox from './ChatBox';

class ChatApp extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            /* Initial client socket */
            socket: io(),
            /* Messages in the form of array of objects: {username: String, content: String} */ 
            messages: [],
            /* Array of all the users as strings */
            users: [],
            /* Array of all users currently typing */
            usersTyping: [],
            /* Current user's username */
            username: ''
        };
    }

    /* Runs when component has been rendered to DOM. */
    componentDidMount()
    {
        let socket = this.state.socket;

        /* Make sure there is a socket in the state. */
        if (socket)
        {
            this.initSocketOnEvents(socket);

            /* Event listener for user refreshing or exiting the page. */
            window.onbeforeunload = () => 
            {
                let username = this.state.username;

                /* Make sure the user has joined the chat room before emitting to others*/
                if (username && socket)
                {
                    /* Let others know you went offline and that you are not typing anymore.*/
                    socket.emit('userDisconnected', {username: username});
                    socket.emit('userTyping', {username: username, typing: false});
                    socket.emit('sendMessage', {content: username + ' left the chat room.'});
                }
            }
        }
    }

    /* Listen for emittions from server for incoming inquiries. */
    initSocketOnEvents(socket)
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

    /* Someone sent a message, update the chat display. */
    onUpdateMessages(message)
    {
        let messages = this.state.messages;
        messages.push(message);
        this.setState({messages: messages}, () => 
        {
            var chatMessages = document.getElementById('chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    /* Someone connected to the chat, notify the chat room. */
    onUserConnected(data)
    {
        /* Add to sidebar list. */
        let users = this.state.users;

        /* Make sure username has been passed through*/
        if (data.username)
        {
            users.unshift(data.username);
        } else
        {
            alert('Error: no username has been passed through.');
        }

        /* Rerender the list of users in the chat. */
        this.setState({users: users});
    }

    /* Someone else disconnected, update your view. */
    onUserDisconnected(data)
    {
        let users = this.state.users;
        let index = users.indexOf(data.username);
        
        /* Remove disconnected user from the list of users. */
        if (index !== -1)
        {
            users.splice(index, 1);
            this.setState({users: users});
        } else
        {
            /* Error: user not in list */
            // alert('Error: user is not in the list');
            // console.log('User not in list.');
        }
    }

    /* Someone else in the chat is typing, update your view. */
    onUserTyping(data)
    {
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
            {
                // console.log(data.username + ' is typing');
            }

            /* Error: user is not typing. */
            else
                console.log(data.username + ' is already not typing.');
        }

        /* Rerender the users typing. */
        this.setState({usersTyping: usersTyping});
    }

    /* ------------------End on socket methods-------------------- */

    /* ------------------Chat events-------------------- */

    /* On chat form submit, emit post message to others. */
    handleChatFormSubmit(inputMessage)
    {
        let username = this.state.username;
        let socket = this.state.socket;

        if (socket && username)
        {
            if (inputMessage.value)
            {
                /* Sends message to other users and then resets & refocuses on input. */
                socket.emit('sendMessage', {sender: username, content: inputMessage.value});
                socket.emit('userTyping', {username: username, typing: false});
                inputMessage.value = '';
                inputMessage.focus();
            }
        } else
        {
            alert('Please set a username first.');
        }
    }

    /* On username form submit, emit user connected to others */
    /* Users are only allowed to set username once. */
    handleUsernameFormSubmit(e, inputUsername)
    {
        let socket = this.state.socket;
        let username = inputUsername.value;
        if (socket && username)
        {
            /* If username is not taken */
            if (this.state.users.indexOf(username) == -1)
            {
                this.setState({username: username});
                socket.emit('userConnected', {username: username});
                socket.emit('sendMessage', {content: username + ' joined the chat room.'});

                /* Remove this form and input. Do not allow user to change usernames. */
                e.target.remove(inputUsername);
                e.target.remove(e.target.submit);
                this.ChatBox.focusInputMessage();
            } 

            /* If username is taken */
            else
            {
                alert('Username is in use. Please choose another username.');
                inputUsername.value = '';
                inputUsername.focus();
            }
        }
    }

    /* When user is typing, emit typing to server. */
    handleInputMessage(inputMessage)
    {
        let username = this.state.username;
        let socket = this.state.socket;
        let typing = inputMessage.value ? true : false;

        if (socket && username)
        {
            /* Tell other users that this user is typing or not typing. */
            socket.emit('userTyping', {username: username, typing: typing});
        } else
        {
            /* Socket or username hasn't been set yet' */
        }
    }
    
    /* ------------------End chat events-------------------- */

    /* Converts the message to JSX HTML component. */
    convertMessages(e, i)
    { 
        return (
            <div key={i} className={e.sender === this.state.username?'bg-info':!e.sender?'bg-warning':'bg-success'}>
                {
                    e.sender &&
                    <div className="username">
                        <b>{e.sender}</b>
                    </div>
                }
                {e.content}
            </div>
        );;
    }

    /* Converts the user to JSX HTML component. */
    convertUsers(e, i)
    {
        return (
            <li key={i} className="">
                {e += e === this.state.username ? " (you)" : ""}
            </li>
        );;
    }

    /* Makes the string of users typing depending on who is/are typing. */
    createUsersTypingString(usersTyping)
    {
        if (usersTyping.length > 0)
        {
            if (usersTyping.length > 3)
            {
                return usersTyping.length + ' users typing...';
            } else
            {
                let string = usersTyping.join(',');

                if (usersTyping.length == 1)
                {
                    string += ' is typing...';
                } else
                {
                    string += ' are typing...';
                }

                return string;
            }
        }

        return '';
    }

    render()
    {
        let messages = this.state.messages.map(this.convertMessages, this);
        let users = this.state.users.map(this.convertUsers, this);
        let usersTyping = this.createUsersTypingString(this.state.usersTyping);

        return (
            <div className="">
                <div className="text-center">
                    <h1>OP CHAT</h1>
                </div>
                <div className="chat-app container center-block">
                    <div className="row">
                        <SideBar
                            users = {users}
                            submitUsernameForm = {(e, inputUsername) => this.handleUsernameFormSubmit(e, inputUsername)}
                        />
                        <ChatBox
                            ref = {(ref) => this.ChatBox = ref}
                            messages = {messages}
                            usersTyping = {usersTyping}
                            submitChatForm = {(e) => this.handleChatFormSubmit(e)}
                            onInputMessage = {(e) => this.handleInputMessage(e)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<ChatApp/>, document.getElementById('chatApp'));