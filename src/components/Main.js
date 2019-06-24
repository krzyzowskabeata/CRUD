import React from 'react';
import {Link, NavLink} from 'react-router-dom';

const Main = () => (
    <div className="container transparent">
        <div className="main">
            <div className="navigation">
                <NavLink to="/" className="active_nav">
                    <div>MAIN</div>
                </NavLink>
                <NavLink to="/users">
                    <div>USERS</div>
                </NavLink>
                <NavLink to="/groups">
                    <div>GROUPS</div>
                </NavLink>
            </div>
            <div className="main_content">
            </div>
        </div>
    </div>
);

export default Main;