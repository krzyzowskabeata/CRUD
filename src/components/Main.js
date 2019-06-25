import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom';

class Main extends Component {

    state = {
        url: "http://localhost:3500",
        admins: [],
        savedUser: "",
        login: "",
        password: "",
        isChecked: false,
        greeting: "",
        placeholderLogin: "Login",
        placeholderPassword: "Password",
        validLogin: true,
        validPassword: true,
        redirect: ""
    };

    componentDidMount() {
        var savedUser = localStorage.getItem("savedUser");

        if(savedUser) {
            this.setState({
                savedUser,
                greeting: savedUser,
            });
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    toggleChange = () => {
        this.setState({
            isChecked: !this.state.isChecked,

        });
    };

    handleLogin = (e) => {
        e.preventDefault();

        // admins
        fetch(`${this.state.url}/admins?guid=${this.state.login}`).then(el => el.json())
            .then(admins => {
                if(admins.length) {
                    this.setState({
                        admins
                    }, function() {
                        this.handlePassword();
                    });
                } else {
                    this.handlePassword();
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    handlePassword = () => {
        this.setState({
            validLogin: true,
            validPassword: true
        });

        if(!this.state.admins.length) {
            this.setState({
                login: "",
                password: "",
                placeholderLogin: "No user",
                validLogin: false
            });
        }

        if(this.state.admins.length !== 0 && this.state.admins[0].password !== this.state.password) {
            this.setState({
                password: "",
                placeholderPassword: "Faulty password",
                validPassword: false
            });
        }

        if(this.state.admins.length !== 0 && this.state.isChecked) {
            localStorage.setItem("savedUser", this.state.admins[0].name);

            this.setState({
                savedUser: this.state.admins[0].name
            });
        }
        this.setState({
            greeting: this.state.admins[0].name
        });
    };

    handleLogout = (e) => {
        e.preventDefault();

        localStorage.removeItem("savedUser");
        this.setState({
            savedUser: "",
            login: "",
            password: "",
            isChecked: false,
            greeting: "",
            placeholderLogin: "Login",
            placeholderPassword: "Password",
            validLogin: true,
            validPassword: true,
        });
    };

    render() {
        if(this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        } else if((this.state.savedUser || this.state.greeting) && (this.state.validLogin && this.state.validPassword)) {
            return (
                <div className="container transparent">
                    <div className="main">
                        <div className="navigation">
                            <NavLink to="/" className="active_nav">
                                <div></div>
                            </NavLink>
                            <NavLink to="/users">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="main_content greeting">
                            <h2>{"Hi " + this.state.greeting + "!"}</h2>
                            <h2>What would you like to manage?</h2>
                            <div>
                                <NavLink to="/users">
                                    <button className={"btn_log btn_active"} onMouseEnter={this.handleActive}>
                                        USERS
                                    </button>
                                </NavLink>
                                <NavLink to="/groups">
                                    <button className={"btn_log btn_active"}>
                                        GROUPS
                                    </button>
                                </NavLink>
                            </div>
                            <button className={"btn_log btn_logout"} onClick={this.handleLogout}>Log out</button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container transparent">
                    <div className="main">
                        <div className="navigation">
                            <NavLink to="/" className="active_nav">
                                <div></div>
                            </NavLink>
                            <NavLink to="/users">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <form className="main_content logpanel">
                            <h2>Log into CRUD</h2>
                            <input type="name" placeholder={this.state.placeholderLogin}
                                   value={this.state.login} id="login" onChange={this.handleChange}
                                   className={this.state.validLogin ? "" : "invalid"} />

                            <input type="password" placeholder={this.state.placeholderPassword}
                                   value={this.state.password} id="password" onChange={this.handleChange}
                                   className={this.state.validPassword ? "" : "invalid"} />
                            <div>
                                <label className={this.state.isChecked ? "remember" : ""}>
                                    <input type="checkbox"
                                           checked={this.state.isChecked}
                                           onChange={this.toggleChange} />
                                    Remember
                                </label>
                                <button className={"btn_log_small"} type="submit" onClick={this.handleLogin}>Log in</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }
}

export default Main;