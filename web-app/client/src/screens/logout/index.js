import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import Login from '../login';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table/react-table.css'



const Logout = (props) => {
    console.log('in logout', props);

    useEffect(() => {
        localStorage.clear();
    }, []);


    return (
        <Login />
    );
}

export default withRouter(Logout);