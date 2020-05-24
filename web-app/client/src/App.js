import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Store } from '../src/components/Hooks';
import { Spin } from 'antd';
import AuthenticateRoute from '../src/components/routes/AuthenticateRoute'
import LayoutPage from '../src/screens/layout'
import Admin from '../src/screens/Admin'
import User from '../src/screens/User'
import Consumer from '../src/screens/Consumer';
import Login from '../src/screens/login'
import Logout from '../src/screens/logout';
import NotFoundScreen from '../src/screens/NotFoundScreen';

function App(props) {

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(false);
  }, [])


  return (
    loader
      ? <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 300 }}>
        <Spin size="large" />
      </div>
      :
      <Router>
        <Switch>
          <Route path="/404" component={() => <NotFoundScreen />} />
          <Route path="/login" component={() => <Login />} />
          <Route path="/logout" component={() => <Logout />} />

          <AuthenticateRoute exact path="/admin" component={Admin} title='Welcome Admin' store={Store} />
          <AuthenticateRoute exact path="/entity/create" component={Admin} title='Create Entity' store={Store} />
          <AuthenticateRoute exact path="/entity/edit" component={Admin} title='Edit Entity' store={Store} />
          <AuthenticateRoute exact path="/entity/list" component={Admin} title='List Entities' store={Store} />
          <AuthenticateRoute exact path="/entity-user/create" component={Admin} title='Create Entity User' store={Store} />
          <AuthenticateRoute exact path="/entity-user/list" component={Admin} title='List Entity User' store={Store} />
          <AuthenticateRoute exact path="/entity-user/edit" component={Admin} title='Edit Entity User' store={Store} />
          <AuthenticateRoute exact path="/consumers-list" component={Admin} title='List Consumer' store={Store} />
          {/* <AuthenticateRoute exact path="/logout" component={Admin} title='Logout admin' store={Store} /> */}

          <AuthenticateRoute exact path="/user" component={User} title='Welcome User' store={Store} />
          <AuthenticateRoute exact path="/consumer/create" component={User} title='Create Consumer' store={Store} />
          <AuthenticateRoute exact path="/consumer/edit" component={User} title=' Edit Consumer' store={Store} />
          <AuthenticateRoute exact path="/consumer/list" component={User} title='List Consumer' store={Store} />
          <AuthenticateRoute exact path="/entity/grant-token" component={User} title='Grant Token to Entity' store={Store} />
          <AuthenticateRoute exact path="/consumer/grant-token" component={User} title='Grant Token to Consumer' store={Store} />
          <AuthenticateRoute exact path="/consumer/redeem-token" component={User} title='Redeem Token' store={Store} />
          {/* <AuthenticateRoute exact path="/logout" component={User} title='Logout admin' store={Store} /> */}

          <AuthenticateRoute exact path="/consumer" component={Consumer} title='Welcome Consumer' store={Store} />

          <Route path="/" component={() => <Login />} />

          <Redirect to='/404'></Redirect>
        </Switch>
      </Router>

  );
}

export default App;
