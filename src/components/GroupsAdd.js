import React, {Component} from 'react';

class GroupsAdd extends Component {
    state = {
        url: "http://localhost:3500",
        permissions: [],
        name: "",
        description: "",
        currPerms: [],
        valid: false,
        validName: true,
        validDesc: true
    };

    componentDidMount() {
        // permissions
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
            [e.target.name]: e.target.value
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
            validDesc: true,
        });

        if(this.state.name.length < 3) {
            this.setState({
                valid: false,
                validName: false
            });
        }

        if(this.state.description.length < 3) {
            this.setState({
                valid: false,
                validDesc: false
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

        // additional name unique check
        fetch(`${this.state.url}/groups?name=${this.state.name}`).then(el => el.json())
            .then(groups => {
                if(groups.length) {
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
                description: this.state.description
            };

            fetch(`${this.state.url}/groups`, {
                method: 'POST',
                body: JSON.stringify(newGroup),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(group => {

                    if(this.state.currPerms.length) {
                        fetch(`${this.state.url}/groups?name=${newGroup.name}`).then(el => el.json())
                            .then(group => {

                                // new group id
                                const currPermsId = [];

                                this.state.permissions.forEach(e => {
                                    this.state.currPerms.forEach(el => {
                                        if(el === e.name) {
                                            currPermsId.push(e.id);
                                        }
                                    });
                                });

                                currPermsId.forEach(elem => {
                                    const newGroupsPerm = {
                                        groupID: group[0].id,
                                        permissionsId: elem
                                    };

                                    fetch(`${this.state.url}/groupsPermissions`, {
                                        method: 'POST',
                                        body: JSON.stringify(newGroupsPerm),
                                        headers:{
                                            'Content-Type': 'application/json'
                                        }
                                    }).then(res => res.json())
                                        .catch(err => console.log(err));
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                })
                .catch(err => console.log(err));
        }

    };

    render() {
       return (
            <form className="groups_add" onSubmit={this.handleSubmit}>
                <label>
                    Name
                    <br/>
                    <input type="text" name="name"
                    className={this.state.validName ? "" : "not_valid"} onChange={this.handleChange} />
                </label>
                <label>
                    Description
                    <br/>
                    <textarea name="description" rows="6"
                    className={this.state.validDesc ? "" : "not_valid"} onChange={this.handleChange}/>
                </label>
                <label>
                    Permissions (not obligatory)
                    <br/>
                </label>
                <div className="checkboxes">
                    {this.state.permissions.map(e => {
                        return (
                            <label key={e.id}>
                                <input type="checkbox" name={e.name} onClick={this.handleChoice} />
                                {e.name}
                            </label>
                        );
                    })}
                </div>
                <button type="submit" className="sub_btn">Submit</button>
                {this.state.valid ? <h4 className="added">Group was successfully added!</h4> : ""}
            </form>
        );
    }
}

export default GroupsAdd;