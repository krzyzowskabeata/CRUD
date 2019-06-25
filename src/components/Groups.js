import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import GroupsAdd from "./GroupsAdd";
import GroupsEdit from "./GroupsEdit";

class Groups extends Component {
    state = {
        url: "http://localhost:3500",
        groups: [],
        groupsPermissions: [],
        permissions: [],
        loginIdInit: "",
        nameId: "",
        currGroups: [],
        currGroupsPermissions: [],
        editGroup: [],
        editGroupPermissions: [],
        nameValid: true,
        showTable: false,
        page: 1,
        startNum: 1,
        nextStop: false,
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
                nameValid: true,
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
            loginIdInit: e.target.value,
            nameId: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            groups: [],
            groupsPermissions: [],
            permissions: [],
            loginIdInit: "",
            currGroups: [],
            currGroupsPermissions: [],
            showTable: false,
            page: 1,
            startNum: 1,
            nextStop: false
        });

        this.handleGroups();
    };

    handleGroups = () => {

        // groups.name
        fetch(`${this.state.url}/groups?q=${this.state.nameId}&_page=${this.state.page}&_limit=5`).then(el => el.json())
            .then(groups => {
                if(groups.length) {
                    this.setState({
                        groups,
                        groupsPermissions: [],
                        permissions: [],
                        currGroups: [],
                        currGroupsPermissions: [],
                        nextStop: false
                    });
                    this.handleGroupsPermissions();
                } else {
                    this.setState({
                        // groupsPermissions: [],
                        // permissions: [],
                        // currGroups: [],
                        // currGroupsPermissions: [],
                        page: this.state.page - 1,
                        startNum: this.state.startNum - 5,
                        nextStop: true
                    });
                }
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

        if(e.target.name === "prev" && this.state.page > 1) {
            this.setState({
                page: this.state.page - 1,
                startNum: this.state.startNum - 5
            }, function() {
                this.handleGroups();
            });
        }

        if(e.target.name === "next" ) {
            this.setState({
                page: this.state.page + 1,
                startNum: this.state.startNum + 5
            }, function() {
                this.handleGroups();
            });
        }
    };

    handleSelect = (e) => {
        const groupId = e.currentTarget.getAttribute("id");

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
                                <div>LOG</div>
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
                                <div>LOG</div>
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
                                <div>LOG</div>
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
                                           value={this.state.loginIdInit}
                                           className={this.state.nameValid ? "" : "not_valid"} />
                                </label>
                                <button type="submit" className="sub_btn">Search</button>
                            </form>
                            <div className={this.state.currGroups.length ? "" : "hidden"}>
                                <button name="prev" onClick={this.handlePage}
                                        className={this.state.page > 1 ? "prev_next_btn active" : "prev_next_btn"}>
                                    Prev
                                </button>
                                <button name="next" onClick={this.handlePage}
                                        className={!this.state.nextStop ? "prev_next_btn active" : "prev_next_btn"}>
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
                                    return (
                                        <tr className="row" key={e.id} id={e.id} onClick={this.handleSelect}>
                                            <td>{index + this.state.startNum}</td>
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