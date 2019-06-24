import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import GroupsAdd from "./GroupsAdd";
import GroupsEdit from "./GroupsEdit";

class Groups extends Component {
    state = {
        url: "http://localhost:3000",
        groups: [],
        groupsPermissions: [],
        permissions: [],
        nameId: "",
        currGroups: [],
        currGroupsPermissions: [],
        editGroup: [],
        editGroupPermissions: [],
        nameValid: true,
        showTable: false,
        fromIndex: 0,
        toIndex: 6,
        addBtn: false,
        editBtn: false,
        searchBtn: false
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
                nameValid: true,
                editUser: [],
                editUserGroups: []
            });
        }
    };

    handleChange = (e) => {
        this.setState({
            nameValid: true,
            nameId: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            groups: [],
            groupsPermissions: [],
            permissions: [],
            currGroups: [],
            currGroupsPermissions: [],
            showTable: false,
            fromIndex: 0,
            toIndex: 6,
        });

        // groups.name
        fetch(`${this.state.url}/groups?name=${this.state.nameId}`).then(el => el.json())
            .then(groups => {
                this.setState({
                    groups
                });

                // groups.id
                fetch(`${this.state.url}/groups?id=${this.state.nameId}`).then(el => el.json())
                    .then(groups => {
                        this.setState({
                            groups: [...this.state.groups,...groups]
                        });
                        this.handleGroupsPermissions();
                    })
                    .catch(err => {
                        console.log(err);
                    });

                this.setState({
                    nameId: ""
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleGroupsPermissions = () => {
        if(this.state.groups.length) {
            this.state.groups.forEach(e => {

                // groupsPermissions
                fetch(`${this.state.url}/groupsPermissions?groupID=${e.id}`).then(el => el.json())
                    .then(groupsPermissions => {
                        this.setState({
                            groupsPermissions: [...this.state.groupsPermissions,...groupsPermissions]
                        });
                        this.handlePermissions();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        }
    };

    handlePermissions = () => {
        if(this.state.groupsPermissions.length) {
            this.state.groupsPermissions.forEach(e => {

                // permissions
                fetch(`${this.state.url}/permissions?id=${e.permissionsId}`).then(el => el.json())
                    .then(permissions => {
                        if(!this.state.currGroupsPermissions.filter(el => el.id === e.permissionsId).length) {
                            this.setState({
                                currGroupsPermissions: [...this.state.currGroupsPermissions, ...permissions]
                            });
                        }
                        this.handleCurrentGroups();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        } else {
            this.handleCurrentGroups();
        }
    };

    handleCurrentGroups = () => {
        let currGroups = [];

        this.state.groups.forEach(e => {
            let singleGroupPermissions = [];

        if(this.state.groupsPermissions.length) {
            this.state.groupsPermissions.forEach(el => {
                if(e.id === el.groupID) {
                    this.state.currGroupsPermissions.forEach(elm => {
                        if(el.permissionsId === elm.id) {
                            const perm = {
                                name: elm.name,
                                description: elm.description
                            };
                            singleGroupPermissions.push(perm);
                        }
                    })
                }
            });
        }
            const currGroup = {
                id: e.id,
                name: e.name,
                description: e.description,
                permissions: singleGroupPermissions
            };
            currGroups.push(currGroup);
        });

        this.setState({
            currGroups,
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

        if(e.target.name === "next" && this.state.toIndex < this.state.currGroups.length) {
            this.setState({
                fromIndex: this.state.fromIndex + 6,
                toIndex: this.state.toIndex + 6,
            });
        }
    };

    handleSelect = (e) => {
        const groupId = e.target.parentElement.getAttribute("id");

        const editGroup = this.state.groups.filter(e => e.id === groupId);
        const editGroupPermissions = this.state.currGroupsPermissions.filter(e => e.groupID === editGroup.id);

        this.setState({
            editGroup,
            editGroupPermissions,
            // editGroupId: this.state.usersGroups,
            editBtn: true,
            currGroups: []
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
                            <NavLink to="/users">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups" className="active_nav">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="groups_content">
                            <button name="searchBtn" onClick={this.handleManage}
                                    className={this.state.addBtn || this.state.editBtn ? "search_btn" : "search_btn search_active"}>
                                Search group
                            </button>
                            <button name="addBtn" onClick={this.handleManage}
                                    className={this.state.addBtn ? "add_btn add_active" : "add_btn"}>
                                Add new group
                            </button>
                            <button name="editBtn" onClick={this.handleManage}
                                    className={this.state.editBtn ? "edit_btn edit_active" : "edit_btn"}>
                                Edit group
                            </button>
                            <GroupsAdd />
                        </div>
                    </div>
                </div>
            );
        } else if(this.state.editBtn && this.state.editGroup.length) {
            return (
                <div className="container transparent">
                    <div className="main">
                        <div className="navigation">
                            <NavLink to="/">
                                <div>MAIN</div>
                            </NavLink>
                            <NavLink to="/users">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups" className="active_nav">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="groups_content">
                            <button name="searchBtn" onClick={this.handleManage}
                                    className={this.state.addBtn || this.state.editBtn ? "search_btn" : "search_btn search_active"}>
                                Search group
                            </button>
                            <button name="addBtn" onClick={this.handleManage}
                                    className={this.state.addBtn ? "add_btn add_active" : "add_btn"}>
                                Add new group
                            </button>
                            <button name="editBtn" onClick={this.handleManage}
                                    className={this.state.editBtn ? "edit_btn edit_active" : "edit_btn"}>
                                Edit group
                            </button>
                            <GroupsEdit editGroup={this.state.editGroup}
                                        editGroupPermissions={this.state.editGroupPermissions} />
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
                            <NavLink to="/users">
                                <div>USERS</div>
                            </NavLink>
                            <NavLink to="/groups" className="active_nav">
                                <div>GROUPS</div>
                            </NavLink>
                        </div>
                        <div className="groups_content">
                            <button name="searchBtn" onClick={this.handleManage}
                                    className={this.state.addBtn || this.state.editBtn ? "search_btn" : "search_btn search_active"}>
                                Search group
                            </button>
                            <button name="addBtn" onClick={this.handleManage}
                                    className={this.state.addBtn ? "add_btn add_active" : "add_btn"}>
                                Add new group
                            </button>
                            <button name="editBtn" onClick={this.handleManage}
                                    className={this.state.editBtn ? "edit_btn edit_active" : "edit_btn"}>
                                Edit group
                            </button>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Group (name or id)
                                    <br/>
                                    <input type="text" name="name" onChange={this.handleChange}
                                           value={this.state.nameId}
                                           className={this.state.nameValid ? "" : "not_valid"} />
                                </label>
                                <button type="submit" className="sub_btn">Search</button>
                            </form>
                            <div className={this.state.currGroups.length > 6? "" : "hidden"}>
                                <button name="prev" onClick={this.handlePage}
                                        className={this.state.currGroups.length > 6 ? "prev_next_btn active" : "prev_next_btn"}>
                                    Prev
                                </button>
                                <button name="next" onClick={this.handlePage}
                                        className={this.state.currGroups.length > 6 ? "prev_next_btn active" : "prev_next_btn"}>
                                    Next
                                </button>
                            </div>
                            <table className={this.state.currGroups.length ? "table_groups" : "hidden"}>
                                <tbody>
                                <tr>
                                    <th>No.</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Permissions</th>
                                </tr>
                                {this.state.currGroups.map((e, index) => {
                                    if(index >= this.state.fromIndex && index < this.state.toIndex) {
                                        return (
                                            <tr className="row" key={e.id} id={e.id} onClick={this.handleSelect}>
                                                <td>{index + 1}</td>
                                                <td>{e.name}</td>
                                                <td>{e.description}</td>
                                                <td>
                                                    {e.permissions.map((el, index) => {
                                                        return <span className="tooltip" key={index} id={el.description}
                                                                     onMouseOver={this.tipsOn} onMouseLeave={this.tipsOff}>
                                                            {el.name + " "}
                                                        </span>
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

export default Groups;