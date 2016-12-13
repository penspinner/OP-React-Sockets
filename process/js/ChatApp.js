import React from 'react';
import ReactDOM from 'react-dom';

class ChatApp extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {socket: io(), messages: ['test messages']};
        console.log(this.state.socket);
    }

    /* Runs when component has been rendered to DOM. */
    componentDidMount()
    {
        console.log('did mount');
        let socket = this.state.socket,
            chatMessages = document.getElementById('chatMessages'),
            message = document.getElementById('message');

        /* On form submit, emit post message to server. */
        socket.on('connect', () =>
        {
            var chatForm = document.forms.chatForm;

            if (chatForm)
            {
                chatForm.addEventListener('submit', (e) =>
                {
                    e.preventDefault();
                    socket.emit('postMessage', {message: message.value});
                    message.value = '';
                    message.focus();
                });

                socket.on('updateMessages', (data) =>
                {
                    console.log(data);
                    // this.setState({messages: data});
                });
            }
        });
    }



    render()
    {
        let messages = this.state.messages.map((e) => {return true;});

        return (
            <div className="center-block">
                <div id="chatMessages">{messages}</div>
                <form name="chatForm">
                    <div className="form-group">
                        <input type="text" name="message" id="message" className="form-control" required></input>
                        <button type="submit" className="btn btn-primary">Send</button>
                    </div>
                </form>
            </div>
        );
    }
}

ReactDOM.render(<ChatApp/>, document.getElementById('chatApp'));