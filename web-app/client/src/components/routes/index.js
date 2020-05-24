import React from 'react';
import Movie from '../../screens/Home';
import NotFoundScreen from '../../screens/NotFoundScreen'
import LayoutPage from '../../screens/layout'

import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";


const AppRoute = (props) => {
    console.log("props in route", props);
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={() => <Movie store={props.store} />} />
                <Route exact path="/layout" component={() => <LayoutPage title="Layout page" />} />
                <Route path='/404' component={() => <NotFoundScreen />} />
                <Redirect to='/404'></Redirect>
            </Switch>
        </Router>
    );
}

export default AppRoute;
