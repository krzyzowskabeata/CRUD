import React, {Component} from 'react';

class UsersAdd extends Component {
    state = {
        url: "http://localhost:3000",
        groups: [],
        guid: "",
        name: "",
        currGroups: [],
        valid: false,
        validGuid: true,
        validName: true,
        validCheckboxes: true
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

    render() {
        if(this.state.valid) {
            // users
            const newUser = {
                guid: this.state.guid,
                name: this.state.name
            };

            fetch(`${this.state.url}/users`, {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .catch(err => console.log(err));

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
            <form className="users_add" onSubmit={this.handleSubmit}>
                <label>
                    Login
                    <br/>
                    <input type="text" name="guid"
                    className={this.state.validGuid ? "" : "not_valid"} onChange={this.handleChange} />
                </label>
                <label>
                    Name
                    <br/>
                    <input type="text" name="name"
                    className={this.state.validName ? "" : "not_valid"} onChange={this.handleChange}/>
                </label>
                <label>
                    Group
                    <br/>
                </label>
                <div className={this.state.validCheckboxes ? "checkboxes" : "checkboxes not_valid_checkboxes"}>
                    {this.state.groups.map(e => {
                        return (
                            <label key={e.id}>
                                <input type="checkbox" name={e.name} onClick={this.handleChoice} />
                                {e.name}
                            </label>
                        );
                    })}
                </div>
                <button type="submit" className="sub_btn">Submit</button>
                {this.state.valid ? <h4 className="added">User was successfully added!</h4> : ""}
            </form>
        );
    }
}

export default UsersAdd;