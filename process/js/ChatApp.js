import React from 'react';
import ReactDOM from 'react-dom';

class ChatApp extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {};
    }

    componentDidMount()
    {
        
    }

    render()
    {
        return (
            <div className="">
                <div id="messages"></div>
                <div>Temp</div>
            </div>
        );
    }
}

ReactDOM.render(<ChatApp/>, document.getElementById('chatApp'));