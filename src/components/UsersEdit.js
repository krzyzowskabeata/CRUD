import React, {Component} from 'react';
import {NavLink} from "react-router-dom";

class UsersEdit extends Component {
    state = {
        url: "http://localhost:3000",
        editUser: this.props.editUser,
        groups: [],
        guid: this.props.editUser[0].guid,
        name: this.props.editUser[0].name,
        currGroups: [],
        valid: false,
        validGuid: true,
        validName: true,
        validCheckboxes: true,
        validDelete: false
    };

    componentDidMount() {
        // groups
        fetch(`${this.state.url}/groups`).then(el => el.json())
            .then(groups => {
                this.setState({
                    groups
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            valid: false,
            validGuid: true,
            validName: true,
            validCheckboxes: true,
        });
    };

    handleChoice = (e) => {
        e.preventDefault();

        if(e.target.parentElement.className === "checked") {
            e.target.parentElement.classList.remove("checked");
        } else {
            e.target.parentElement.classList.add("checked");
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            valid: true,
            validGuid: true,
            validName: true,
            validCheckboxes: true
        });

        if(this.state.guid.length < 3) {
            this.setState({
                valid: false,
                validGuid: false
            });
        }

        if(this.state.name.length < 3) {
            this.setState({
                valid: false,
                validName: false
            });
        }

        const [...checkboxesElements] = document.querySelectorAll("[type=checkbox]");
        const currGroups = [];

        checkboxesElements.forEach(e => {
            if(e.parentElement.className === "checked") {
                currGroups.push(e.getAttribute("name"));
            }
        });

        if(!currGroups.length) {
            this.setState({
                valid: false,
                validCheckboxes: false
            });
        } else {
            this.setState({
                currGroups
            });
        }
    };

    handleDelete = (e) => {
        e.preventDefault();

        this.setState({
            valid: false,
            validGuid: true,
            validName: true,
            validCheckboxes: true
        });


        if(e.target.name === "delete") {
            const idDelete = this.state.editUser[0].id;

            // delete user
            fetch(`${this.state.url}/users/${idDelete}`, {
                method: 'DELETE'
            }).then(users => {
                })
                .catch(err => {
                    console.log(err);
                });

            if(this.state.editUser[0].groups.length) {

                // delete user's groups
                this.state.editUser[0].groups.forEach(e => {
                    const idGroupDelete = e.relId;

                    fetch(`${this.state.url}/usersGroups/${idGroupDelete}`, {
                        method: 'DELETE'
                    }).then(users => {
                        this.setState({
                            validDelete: true
                        });
                    }).catch(err => console.log(err));
                });
            }
        }
    };

    render() {
        if(this.state.valid) {
            // users
            const newUser = {
                guid: this.state.guid,
                name: this.state.name,
                id: this.state.editUser[0].id
            };

            fetch(`${this.state.url}/users/${this.state.editUser[0].id}`, {
                method: 'PUT',
                body: JSON.stringify(newUser),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .catch(err => console.log(err));

            // usersGroups - delete previous
            if(this.state.editUser[0].groups.length) {

                // delete user's groups
                this.state.editUser[0].groups.forEach(e => {
                    const idGroupDelete = e.relId;

                    fetch(`${this.state.url}/usersGroups/${idGroupDelete}`, {
                        method: 'DELETE'
                    }).then(res => res.json())
                    .catch(err => console.log(err));
                });
            }

            // usersGroups
            const currGroupsId = [];

            this.state.groups.forEach(e => {
                this.state.currGroups.forEach(el => {
                    if(el === e.name) {
                        currGroupsId.push(e.id);
                    }
                });
            });

            currGroupsId.forEach(elem => {
                const newUsersGroup = {
                    userGuid: this.state.guid,
                    groupID: elem
                };

                fetch(`${this.state.url}/usersGroups`, {
                    method: 'POST',
                    body: JSON.stringify(newUsersGroup),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                    .catch(err => console.log(err));
            });
        }
        return (
            <form className="users_edit" onSubmit={this.handleSubmit}>
                <label>
                    Login
                    <br/>
                    <input type="text" name="guid" placeholder={this.state.editUser.length ? this.state.editUser[0].guid : ""}
                           onChange={this.handleChange} />
                </label>
                <label>
                    Name
                    <br/>
                    <input type="text" name="name" placeholder={this.state.editUser.length ? this.state.editUser[0].name : ""}
                           onChange={this.handleChange} />
                </label>
                <label>
                    Group
                </label>
                <div className={this.state.validCheckboxes ? "checkboxes" : "checkboxes not_valid_checkboxes"}>
                    {this.state.groups.map(e => {
                        if(this.state.editUser[0].groups.filter(el => el.name === e.name).length) {
                            return (
                                <label key={e.id} className="checked">
                                    <input type="checkbox" name={e.name} onClick={this.handleChoice} />
                                    {e.name}
                                </label>
                            );
                        } else {
                            return (
                                <label key={e.id}>
                                    <input type="checkbox" name={e.name} onClick={this.handleChoice} />
                                    {e.name}
                                </label>
                            );
                        }
                    })}
                </div>
                <div>
                    <button type="submit" name="edit" className="edit_del_btn">Edit</button>
                    <button name="delete" className="edit_del_btn" onClick={this.handleDelete}>Delete</button>
                </div>
                {this.state.valid ? <h4 className="edited">User was successfully edited!</h4> : ""}
                {this.state.validDelete ? <h4 className="deleted">User was successfully deleted!</h4> : ""}
            </form>
        );
    }
}

export default UsersEdit;