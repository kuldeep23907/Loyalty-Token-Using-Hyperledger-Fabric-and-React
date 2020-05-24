import React from "react";
import { Route, Redirect } from "react-router-dom";
import MovieTable from '../../components/movietable';
import MovieForm from '../../components/movieform';
import Dashboard from '../../components/defaultpage';
import UserDashboard from '../../components/userDefaultPage';
import CreateEntity from '../createEntity';
import ListEntity from '../listEntity';
import EditEntity from '../editEntity';
import CreateEntityUser from '../createEntityUser';
import EditEntityUser from '../editEntityUser';
import ListEntityUser from '../listEntityUser';
import CreateConsumer from '../createConsumer'
import GrantTokenToEntity from '../grantTokenToEntity';
import GrantTokenToConsumer from '../grantTokenToConsumer';
import RedeemToken from '../redeemToken';
import ConsumerDashboard from '../consumerDefaultPage';
import EditConsumer from '../editConsumer';
import ListConsumer from '../listConsumer';

export default ({
    component: Component,
    title,
    path,
    store,
}) => (
        <Route
            path={path}
            render={(props) => {
                console.log('in authenticate', Component.name);
                let token = localStorage.getItem('token');
                let role = localStorage.getItem('role');

                let subComponent = '';
                if (Component.name === 'Admin' && role === 'admin') {
                    console.log('here1');
                    if (path === '/entity/create') {
                        subComponent = CreateEntity;
                    } else if (path === '/entity/list') {
                        subComponent = ListEntity;
                    } else if (path === '/entity/edit') {
                        subComponent = EditEntity;
                    } else if (path === '/admin') {
                        console.log('here2');
                        subComponent = Dashboard;
                    } else if (path === '/entity-user/create') {
                        subComponent = CreateEntityUser;
                    } else if (path === '/entity-user/list') {
                        subComponent = ListEntityUser;
                    } else if (path === '/entity-user/edit') {
                        subComponent = EditEntityUser;
                    } else if (path === '/consumers-list') {
                        subComponent = ListConsumer;
                    } 
                } else if (Component.name === 'User' && role === 'worker') {
                    console.log('here1');
                    if (path === '/user') {
                        subComponent = UserDashboard;
                    } else if (path === '/consumer/create') {
                        subComponent = CreateConsumer;
                    } else if (path === '/consumer/edit') {
                        subComponent = EditConsumer;
                    } else if (path === '/consumer/list') {
                        subComponent = ListConsumer;
                    } else if (path === '/entity/grant-token') {
                        subComponent = GrantTokenToEntity;
                    } else if (path === '/consumer/grant-token') {
                        subComponent = GrantTokenToConsumer;
                    } else if (path === '/consumer/redeem-token') {
                        subComponent = RedeemToken;
                    } 
                } else if (Component.name === 'Consumer') {
                    if (path === '/consumer') {
                        subComponent = ConsumerDashboard;
                    } 
                }
                return (
                    token ?
                        <Component title={title} store={store} subComponent={subComponent} />
                        :
                        <Redirect
                            LayoutPage to={{
                                pathname: "/login"
                            }}
                        />
                )
            }}
        />
    );