import React, {Component} from "react";
import {HashRouter, Route, Switch} from 'react-router-dom';
import Main from './Main';
import Users from './Users';
import Groups from './Groups';
import None from './None'

class Navigation extends Component {
    render() {
        return (
            <HashRouter>
                <>
                    <Switch>
                        <Route exact path ='/' component={Main} />
                        <Route path ='/users' component={Users} />
                        <Route path ='/groups' component={Groups} />
                        <Route component={None} />
                    </Switch>
                </>
            </HashRouter>
        );
    }
}

export default Navigation;