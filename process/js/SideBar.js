import React from 'react';

class SideBar extends React.Component
{
    submitUsernameForm(e)
    {
        e.preventDefault();
        let inputUsername = this.inputUsername;
        this.props.submitUsernameForm(e, inputUsername);
        this.props.toggleUsernameForm();
    }

    render()
    {
        return (
            <div className="col-sm-3 nopad">
                <div id="chatUsers" className="container-fluid">
                    <h3>Users in chat room</h3>
                    <ul className="userList">{this.props.users}</ul>
                </div>
                {
                    this.props.usernameFormVisible &&
                    <form id="usernameForm" name="usernameForm" onSubmit={(e) => this.submitUsernameForm(e)}>
                        <div className="col-sm-9 nopad">
                            <input type="text" name="username" className="form-control" placeholder="Enter name" ref={(ref) => this.inputUsername = ref} required autoFocus></input>
                        </div>
                        <div className="col-sm-3 nopad">
                            <button type="submit" name="submit" className="form-control btn btn-success">Go</button>
                        </div>
                    </form>
                }
            </div>
        );
    }
}

export default SideBar;