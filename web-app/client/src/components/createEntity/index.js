import React, { useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";

const CreateEntity = (props) => {
  const { state, dispatch } = React.useContext(props.store);
  console.log("state in create entity page", state);
  const [alert, setAlert] = useState(false);
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [externalId, setExternalId] = useState();
  const [type, setType] = useState();
  const [earnRate, setEarnRate] = useState();
  const [entityData, setEntityData] = useState([]);

  const addEntity = () => {
    console.log("add new movie", externalId, type, earnRate);
    let values = { externalId: externalId, type: type, earnRate: earnRate };
    let token = localStorage.getItem('token');
    let url = "http://localhost:8090/entities";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token
      },
      body: JSON.stringify({
        externalId: externalId,
        type: type,
        earnRate: earnRate,
      }),
    })
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        console.log("msg", data);
        setLoader(false);
        if (data.message === "Success") {
          setAlert(false);
          setSuccessMsg(true);
          setEntityData(data.data);
          props.history.push("/admin");
        }
        setSuccessMsg(false);
        setAlert(true);
        // let temp = [...state.movie];
        // console.log(values);
        // temp.push(values);
        // alert('New Movie has been added.');
        // return dispatch({
        //     type: 'ADD_MOVIE',
        //     payload: temp
        // })
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  console.log("movie", state.movie);

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        padding: 20,
      }}
    >
      <div style={{ backgroundColor: "#0663ac" }}>
        {loader ? (
          <Spinner animation="grow" />
        ) : (
            <Form
              onSubmit={(event) => {
                addEntity();
                event.preventDefault();
              }}
              style={{ padding: 20 }}
            >
              <Form.Group controlId="formBasicExternalId">
                <Form.Label style={{ color: "white" }}>External Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter external id"
                  onChange={(event) => {
                    setExternalId(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicEarnRate">
                <Form.Label style={{ color: "white" }}>Earn Rate (between 0.5 to 0.15)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the earn rate"
                  onChange={(event) => {
                    setEarnRate(event.target.value);
                  }}
                />
              </Form.Group>

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
                  <option value="wholesaler"> Wholesaler </option>
                  <option value="distributor"> Distributor </option>
                  <option value="retailer"> Retailer </option>
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form>
          )}
        <div>
          {alert ? (
            <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
              <Alert.Heading>Unable to register</Alert.Heading>
              <p>Enter correct details</p>
            </Alert>
          ) : (
              ""
            )}

          {successMsg ? (
            <Alert variant="success" onClose={() => setSuccessMsg(false)} dismissible>
              <Alert.Heading>Entity registered successfully</Alert.Heading>
              <p>We have mailed the following to the {type} you just registered.</p>
              <p>ID: {entityData.ID} <hr></hr> Created At: {entityData.CreatedAt}</p>
            </Alert>
          ) : (
              ""
            )
          }
        </div>
      </div>
    </div>
  );
};

export default CreateEntity;
