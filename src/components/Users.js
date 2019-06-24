import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import UsersAdd from './UsersAdd';
import UsersEdit from './UsersEdit';

class Users extends Component {
    state = {
        url: "http://localhost:3000",
        users: [],
        usersGroups: [],
        currGroups: [],
        currUsers: [],
        editUser: [],
        guidValid: true,
        loginName: "",
        showTable: false,
        fromIndex: 0,
        toIndex: 6
    };

    handleManage = (e) => {
        e.preventDefault();

        this.setState({
            addBtn: false,
            editBtn: false,
            searchBtn: false
        });

        this.setState({
            [e.target.name]: true
        });

        if(e.target.name === "editBtn") {
            this.setState({
                editUser: [],
                editUserGroups: []
            });
        }

        if(e.target.name === "searchBtn") {
            this.setState({
                // guidValid: true,
                editUser: [],
                editUserGroups: []
            });
        }
    };

    handleChange = (e) => {
        this.setState({
            guidValid: true,
            loginName: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            users: [],
            usersGroups: [],
            currGroups: [],
            currUsers: [],
            showTable: false,
            fromIndex: 0,
            toIndex: 6,
        });

        // users.name
        fetch(`${this.state.url}/users?name=${this.state.loginName}`).then(el => el.json())
            .then(users => {
                this.setState({
                    users
                });

                //users.guid
                fetch(`${this.state.url}/users?guid=${this.state.loginName}`).then(el => el.json())
                    .then(users => {
                        this.setState({
                            users: [...this.state.users,...users]
                        });
                        this.handleUsersGroups();
                    })
                    .catch(err => {
                        console.log(err);
                    });

                this.setState({
                    loginName: ""
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleUsersGroups = () => {
        if(this.state.users.length) {
            this.state.users.forEach(e => {

                // usersGroups
                fetch(`${this.state.url}/usersGroups?userGuid=${e.guid}`).then(el => el.json())
                    .then(usersGroups => {
                        this.setState({
                            usersGroups: [...this.state.usersGroups,...usersGroups]
                        });

                        this.handleGroups();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        }
    };

    handleGroups = () => {
        if(this.state.usersGroups.length) {
            this.state.usersGroups.forEach(e => {

                // groups
                fetch(`${this.state.url}/groups?id=${e.groupID}`).then(el => el.json())
                    .then(groups => {
                        if(!this.state.currGroups.filter(el => el.id === e.groupID).length) {
                            this.setState({
                                currGroups: [...this.state.currGroups,...groups]
                            }, );
                        }
                        this.handleCurrentUsers();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        } else {
            this.handleCurrentUsers();
        }
    };

    handleCurrentUsers = () => {
        let currUsers = [];

        this.state.users.forEach(e => {
            let currUsersGroups = [];

            this.state.usersGroups.forEach(el => {
                if(e.guid === el.userGuid) {

                    this.state.currGroups.forEach(elm => {
                        if(el.groupID === elm.id) {
                            const groupEl = {
                                name: elm.name,
                                description: elm.description,
                                relId: el.id
                            };
                            currUsersGroups.push(groupEl);
                        }
                    })
                }
            });

            const currUser = {
                id: e.id,
                guid: e.guid,
                name: e.name,
                groups: currUsersGroups
            };
            currUsers.push(currUser);
        });

        this.setState({
            currUsers,
            showTable: true
        });
    };

    handlePage = (e) => {
        e.preventDefault();

        if(e.target.name === "prev" && this.state.fromIndex >= 6) {
            this.setState({
                fromIndex: this.state.fromIndex - 6,
                toIndex: this.state.toIndex - 6,
            });
        }

        if(e.target.name === "next" && this.state.toIndex < this.state.currUsers.length) {
            this.setState({
                fromIndex: this.state.fromIndex + 6,
                toIndex: this.state.toIndex + 6,
            });
        }
    };

    handleSelect = (e) => {
        const userId = e.target.parentElement.getAttribute("id");

        const editUser = this.state.currUsers.filter(e => e.id === userId);

        this.setState({
            editUser,
            editBtn: true,
            currUsers: []
        });
    };

    tipsOn = (e) => {
        const currentSpan = e.target;

        const tooltipSpan = document.createElement("span");

        if(currentSpan.getAttribute("id")) {
            tooltipSpan.classList.add("tooltipText");
            currentSpan.appendChild(tooltipSpan).innerText = currentSpan.getAttribute("id");
        }
    };

    tipsOff = (e) => {
        const currentSpan = e.target;
        const toRemove = currentSpan.querySelector(".tooltipText");

        if(currentSpan.getAttribute("id")) {
            currentSpan.removeChild(toRemove);
        }
    };

    render() {
        if(this.state.addBtn) {
            return (
                <div className="container transparent">
                    <div className="main">
                        <div className="navigation">
                            <NavLink to="/">
                                <div>MAIN</div>
                            </NavLink>
                            <NavLink to="/users" className="active_nav">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="users_content">
                            <button name="searchBtn" onClick={this.handleManage}
                                    className={this.state.addBtn || this.state.editBtn ? "search_btn" : "search_btn search_active"}>
                                Search user
                            </button>
                            <button name="addBtn" onClick={this.handleManage}
                                    className={this.state.addBtn ? "add_btn add_active" : "add_btn"}>
                                Add new user
                            </button>
                            <button name="editBtn" onClick={this.handleManage}
                                    className={this.state.editBtn ? "edit_btn edit_active" : "edit_btn"}>
                                Edit user
                            </button>
                            <UsersAdd />
                        </div>
                    </div>
                </div>
            );
        } else if(this.state.editBtn && this.state.editUser.length) {
            return (
                <div className="container transparent">
                    <div className="main">
                        <div className="navigation">
                            <NavLink to="/">
                                <div>MAIN</div>
                            </NavLink>
                            <NavLink to="/users" className="active_nav">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="users_content">
                            <button name="searchBtn" onClick={this.handleManage}
                                    className={this.state.addBtn || this.state.editBtn ? "search_btn" : "search_btn search_active"}>
                                Search user
                            </button>
                            <button name="addBtn" onClick={this.handleManage}
                                    className={this.state.addBtn ? "add_btn add_active" : "add_btn"}>
                                Add new user
                            </button>
                            <button name="editBtn" onClick={this.handleManage}
                                    className={this.state.editBtn ? "edit_btn edit_active" : "edit_btn"}>
                                Edit user
                            </button>
                            <UsersEdit editUser={this.state.editUser} />
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
                                <div>MAIN</div>
                            </NavLink>
                            <NavLink to="/users" className="active_nav">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="users_content">
                            <button name="searchBtn" onClick={this.handleManage}
                                    className={this.state.addBtn || this.state.editBtn ? "search_btn" : "search_btn search_active"}>
                                Search user
                            </button>
                            <button name="addBtn" onClick={this.handleManage}
                                    className={this.state.addBtn ? "add_btn add_active" : "add_btn"}>
                                Add new user
                            </button>
                            <button name="editBtn" onClick={this.handleManage}
                                    className={this.state.editBtn ? "edit_btn edit_active" : "edit_btn"}>
                                Edit user
                            </button>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    User (name or login)
                                    <br/>
                                    <input type="text" name="guid" value={this.state.loginName} onChange={this.handleChange}
                                           className={this.state.guidValid ? "" : "not_valid"} />
                                </label>
                                <button type="submit" className="sub_btn">Search</button>
                            </form>
                            <div className={this.state.currUsers.length > 6? "" : "hidden"}>
                                <button name="prev" onClick={this.handlePage}
                                        className={this.state.currUsers.length > 6 ? "prev_next_btn active" : "prev_next_btn"}>
                                    Prev
                                </button>
                                <button name="next" onClick={this.handlePage}
                                        className={this.state.currUsers.length > 6 ? "prev_next_btn active" : "prev_next_btn"}>
                                    Next
                                </button>
                            </div>
                            <table className={this.state.currUsers.length ? "table_users" : "hidden"}>
                                <tbody>
                                    <tr>
                                        <th>No.</th>
                                        <th>Login</th>
                                        <th>Name</th>
                                        <th>Group</th>
                                    </tr>
                                    {this.state.currUsers.map((e, index) => {
                                        if(index >= this.state.fromIndex && index < this.state.toIndex) {
                                            return (
                                                <tr className="row" key={e.id} id={e.id} onClick={this.handleSelect}>
                                                    <td>{index + 1}</td>
                                                    <td>{e.guid}</td>
                                                    <td>{e.name}</td>
                                                    <td>
                                                        {e.groups.map((el, index) => {
                                                            return (
                                                                <span className="tooltip" key={index}
                                                                      id={el.description}
                                                                      onMouseOver={this.tipsOn} onMouseLeave={this.tipsOff}>
                                                                    {el.name + " "}
                                                                </span>
                                                            );
                                                        })}
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Users;