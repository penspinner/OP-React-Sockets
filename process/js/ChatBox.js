import React from 'react';

class ChatBox extends React.Component
{
    submitChatForm(e)
    {
        e.preventDefault();
        let inputMessage = this.inputMessage;
        this.props.submitChatForm(inputMessage);
        inputMessage.value = '';
        this.focusInputMessage();
    }

    onInputMessage(e)
    {
        let inputMessage = this.inputMessage;
        this.props.onInputMessage(inputMessage);
    }

    focusInputMessage()
    {
        this.inputMessage.focus();
    }

    render()
    {
        return (
            <div className="col-sm-9 nopad">
                <div id="chatMessages">
                    {this.props.messages}
                    <span className="typing">{this.props.usersTyping}</span>
                </div>
                <form name="chatForm" onSubmit={(e) => this.submitChatForm(e)}>
                    <div className="form-group row nopad">
                        <div className="col-sm-10 nopad">
                            <input type="text" className="form-control" placeholder="Message" onInput={(e) => this.onInputMessage(e)} ref={(ref) => this.inputMessage = ref}></input>
                        </div>
                        <div className="col-sm-2 nopad">
                            <button type="submit" className="form-control btn btn-primary">Send</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default ChatBox;