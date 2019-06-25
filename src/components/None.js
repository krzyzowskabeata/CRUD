import React, {Component} from 'react';
import {NavLink, Redirect} from 'react-router-dom';

class None extends Component {

    state = {
        savedUser: "",
        redirect: ""
    };

    componentDidMount() {
        var savedUser = localStorage.getItem("savedUser");

        if(savedUser) {
            this.setState({
                savedUser
            });
        }
    }

    handleLogout = (e) => {
        e.preventDefault();

        localStorage.removeItem("savedUser");
        this.setState({
            savedUser: "",
            redirect: "/"
        });
    };

    render() {
        if(this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        } else if(this.state.savedUser) {
            return (
                <div className="container transparent">
                    <div className="main">
                        <div className="navigation">
                            <NavLink to="/">
                                <div>LOG</div>
                            </NavLink>
                            <NavLink to="/users">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="main_content greeting">
                            <h2>{this.state.savedUser + ", something went wrong!"}</h2>
                            <h4>What would you like to manage?</h4>
                            <div>
                                <NavLink to="/users">
                                    <button className={"btn_log btn_active"} >
                                        USERS
                                    </button>
                                </NavLink>
                                <NavLink to="/groups">
                                    <button className={"btn_log btn_active"}>
                                        GROUPS
                                    </button>
                                </NavLink>
                            </div>
                            <button className={"btn_log btn_logout"} onClick={this.handleLogout}>
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container transparent">
                    <div className="main">
                        <div className="navigation">
                            <NavLink to="/">
                                <div>LOG</div>
                            </NavLink>
                            <NavLink to="/users">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="main_content greeting">
                            <h2>Something went wrong!</h2>
                            <h4>Would you like to log in?</h4>
                            <NavLink to="/">
                                <button className={"btn_log btn_active"}>
                                    Log in
                                </button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default None;