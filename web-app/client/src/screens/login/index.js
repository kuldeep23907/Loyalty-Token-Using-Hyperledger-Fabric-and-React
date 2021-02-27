import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table/react-table.css'



const Login = (props) => {
  console.log('in login', props);
  const [email, setEmail] = useState();
  const [type, setType] = useState();
  const [password, setPassword] = useState();
  const [rememberMe, setRememberMe] = useState();
  const [alert, setAlert] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    let email = localStorage.getItem("email");
    let password = localStorage.getItem("password");
    setEmail(email);
    setPassword(password);
  }, []);


  const login = () => {
    let toPost = type === 'wholesaler'
      || type === 'retailer'
      || type === 'distributor'
      ? 'middlemen' : type;

    fetch('http://localhost:8090/auth/tokens/' + toPost, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'id': email,
        'password': password
      })
    }).then(results => {
      console.log('msg', results);
      return results.json();
    }, (error) => {
      console.log(error);
    }).then(data => {
      console.log('msg', data);
      setLoader(false);
      if (data.message === "Success") {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('id', data.data.id);
        localStorage.setItem('role', data.data.Role)
        localStorage.setItem('entity-type', toPost);
        localStorage.setItem('entity-id', data.data.EntityID);
        localStorage.setItem('name', data.data.Name);
        if (rememberMe) {
          localStorage.setItem('user-id', email);
          localStorage.setItem('password', password);
        }
        if (data.data.Role === "admin") {
          props.history.push('/admin');
        } else if (data.data.Role === "worker") {
          props.history.push('/user');
        } else {
          props.history.push('/consumer');
        }
      }
      setAlert(true);
    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ width: "50%", height: "100%", backgroundColor: "blue" }}>
        <div>
          <img src={require("../../assests/pg_color.png")} alt={"pg-logo"} style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", verticalAlign: "middle" }} />
        </div>
      </div>

      <div style={{ width: "50%", height: "100%", backgroundColor: "white" }}>
        <Form onSubmit={(event) => { setLoader(true); login(); event.preventDefault(); }} style={{ padding: 10, verticalAlign: "middle", marginTop: "35%", marginBottom: "auto", width: "400px", marginLeft: "auto", marginRight: "auto" }} >

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label style={{ color: "white" }}>Select Type</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) => {
                setType(event.target.value);
              }}
            >
              <option value="-1" selected>
                {" "}
                Select{" "}
              </option>
              <option value="manufacturer"> Manufacturer </option>
              <option value="wholesaler"> Wholesaler </option>
              <option value="distributor"> Distributor </option>
              <option value="retailer"> Retailer </option>
              <option value="consumer"> Consumer </option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formBasicEmail" >
            <Form.Control type="text" placeholder="Enter id " onChange={(event) => { setEmail(event.target.value) }} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control type="password" placeholder="Enter Password" onChange={(event) => { setPassword(event.target.value) }} />
          </Form.Group>

          <Button style={{ backgroundColor: "blue" }} variant="primary" type="submit">
            {loader ? <Spinner animation="grow" /> : <h6> Log in</h6>}
          </Button>

          <Form.Group controlId="formBasicCheckbox" style={{ padding: 10 }} onChange={(event) => { setRememberMe(!rememberMe) }}>
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>
        </Form>

        <div>
          {alert ? <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
            <Alert.Heading>Unable to login</Alert.Heading>
            <p>
              Unauthorised User or Enter correct credentials
        </p>
          </Alert> : ''}
        </div>
      </div>
    </div>

  );
}

export default withRouter(Login);