import React, {Component} from 'react';
import {NavLink} from "react-router-dom";

class Groups extends Component {
    state = {
        url: "http://localhost:3500",
        editGroup: this.props.editGroup,
        editGroupPermissions: this.props.editGroupPermissions,
        // editUserGroups: this.props.editUserGroups,
        permissions: [],
        currPerms: [],
        name: this.props.editGroup[0].name,
        description: this.props.editGroup[0].description,
        currGroups: [],
        valid: false,
        validName: true,
        validDesc: true,
        validDelete: false
    };

    componentDidMount() {
        // groups
        fetch(`${this.state.url}/permissions`).then(el => el.json())
            .then(permissions => {
                this.setState({
                    permissions
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
            validName: true,
            validDesc: true,
            validDelete: false
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
            validName: true,
            validDesc: true
        });

        if(this.state.name.length < 3) {
            this.setState({
                valid: false,
                validName: false
            });
        }

        const [...checkboxesElements] = document.querySelectorAll("[type=checkbox]");
        const currPerms = [];

        checkboxesElements.forEach(e => {
            if(e.parentElement.className === "checked") {
                currPerms.push(e.getAttribute("name"));
            }
        });

        if(currPerms.length) {
            this.setState({
                currPerms
            });
        }

        // additional guid unique check
        fetch(`${this.state.url}/groups?name=${this.state.name}`).then(el => el.json())
            .then(groups => {
                if(groups.length && !groups.filter(e => e.id === this.props.editGroup[0].id).length) {
                    this.setState({
                        valid: false,
                        validName: false
                    }, function() {
                        this.handleRender();
                    });
                } else {
                    this.handleRender();
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleRender = () => {
        if(this.state.valid) {
            // groups
            const newGroup = {
                name: this.state.name,
                description: this.state.description,
                id: this.state.editGroup[0].id
            };

            fetch(`${this.state.url}/groups/${this.state.editGroup[0].id}`, {
                method: 'PUT',
                body: JSON.stringify(newGroup),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .catch(err => console.log(err));

            // groupsPermissions - delete previous
            if(this.state.editGroupPermissions.length) {
                this.state.editGroup.forEach(e => {

                    // groupsPermissions.groupID
                    fetch(`${this.state.url}/groupsPermissions?groupID=${e.id}`).then(el => el.json())
                        .then(groupsPermissions => {

                            // groupsPermissions.id - delete
                            groupsPermissions.forEach(el => {
                                fetch(`${this.state.url}/groupsPermissions/${el.id}`, {
                                    method: 'DELETE'
                                }).then(res => res.json())
                                    .catch(err => console.log(err));
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
            }

            if(this.state.currPerms.length) {

                // groupsPermissions
                const currPermsId = [];

                this.state.permissions.forEach(e => {
                    this.state.currPerms.forEach(el => {
                        if(el === e.name) {
                            currPermsId.push(e.id);
                        }
                    });
                });

                currPermsId.forEach(elem => {
                    const newGroupPerms = {
                        groupID: this.state.editGroup[0].id,
                        permissionsId: elem
                    };

                    fetch(`${this.state.url}/groupsPermissions`, {
                        method: 'POST',
                        body: JSON.stringify(newGroupPerms),
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                        .catch(err => console.log(err));
                });
            }
        }
    };

    handleDelete = (e) => {
        e.preventDefault();

        this.setState({
            valid: false,
            validName: true,
            validDesc: true
        });


        if(e.target.name === "delete") {
            const idDelete = this.state.editGroup[0].id;

            // delete group
            fetch(`${this.state.url}/groups/${idDelete}`, {
                method: 'DELETE'
            }).then(groups => {
                })
                .catch(err => {
                    console.log(err);
                });

            if(this.state.editGroupPermissions.length) {
                // delete group's permissions
                this.state.editGroup.forEach(e => {
                    fetch(`${this.state.url}/groupsPermissions?groupID=${e.id}`).then(el => el.json())
                        .then(groupsPermissions => {

                            // groupsPermissions.id - delete
                            groupsPermissions.forEach(el => {
                                fetch(`${this.state.url}/groupsPermissions/${el.id}`, {
                                    method: 'DELETE'
                                }).then(res => res.json())
                                    .catch(err => console.log(err));
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
            }
        }
    };

    render() {
        return (
            <form className="groups_edit" onSubmit={this.handleSubmit}>
                <label>
                    Name
                    <br/>
                    <input type="text" name="name"
                           className={this.state.validName ? "" : "not_valid"}
                           placeholder={this.state.editGroup.length ? this.state.editGroup[0].name : ""}
                           onChange={this.handleChange} />
                </label>
                <label>
                    Description
                    <br/>
                    <textarea name="description" rows="6"
                              className={this.state.validDesc ? "" : "not_valid"}
                              placeholder={this.state.editGroup.length ? this.state.editGroup[0].description : ""}
                              onChange={this.handleChange}/>
                </label>
                <label>
                    Permissions (not obligatory)
                    <br/>
                </label>
                <div className="checkboxes">
                    {this.state.permissions.map(e => {
                        if(this.state.editGroupPermissions.filter(el => el.name === e.name).length) {
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

export default Groups;