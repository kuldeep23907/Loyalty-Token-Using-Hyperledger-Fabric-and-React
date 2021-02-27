import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";

const EditEntity = (props) => {
    const { state, dispatch } = React.useContext(props.store);
    console.log("state in create entity page", state);
    const [alert, setAlert] = useState(false);
    const [loader, setLoader] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [externalId, setExternalId] = useState();
    const [type, setType] = useState();
    const [earnRate, setEarnRate] = useState();
    const [entityData, setEntityData] = useState([]);
    const [entityList, setEntityList] = useState([]);
    const [currentId, setCurrentId] = useState();
    const [currentIdData, setCurrentIdData] = useState([]);
    const [listItems, setListItems] = useState([]);

    useEffect(() => {
        fetchEntityDataAction();
    }, []);

    const fetchEntityDataAction = () => {
        let token = localStorage.getItem("token");
        fetch("http://localhost:8090/entities", {
            method: "GET",
            headers: {
                "x-access-token": token,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((results) => {
                setLoader(false);
                return results.json();
            })
            .then((data) => {
                setEntityList(data.data);
                let x = data.data.map((entity) =>
                    <option value={entity.Key} key={entity.Key}> {entity.Key} </option>
                )
                setListItems(x);
                console.log('list-items', listItems);
                // return dispatch({
                //   type: "UPDATE_USER",
                //   payload: data[0],
                // });
            });
    };


    const editEntity = () => {
        let token = localStorage.getItem('token');
        let url = "http://localhost:8090/entities/" + currentId;
        fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({
                externalId: currentIdData.ExternalID,
                type: currentIdData.Type,
                earnRate: earnRate ? earnRate : currentIdData.EarnRate,
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
                                editEntity();
                                event.preventDefault();
                            }}
                            style={{ padding: 20 }}
                        >
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label style={{ color: "white" }}>Select Entity</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={(event) => {
                                        setCurrentId(event.target.value);
                                        console.log(entityList);
                                        let currentData = [];
                                        let entity;
                                        for (entity of entityList) {
                                            console.log('chk', entity.Key);
                                            if (entity.Key === event.target.value) {
                                                currentData = entity.Record;
                                                break;
                                            }
                                        }
                                        setCurrentIdData(currentData);
                                        console.log('magic', currentData);
                                    }}
                                >
                                    {listItems}
                                </Form.Control>
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

                            <Button variant="primary" type="submit">
                                Submit
            </Button>
                        </Form>
                    )}
                <div>
                    {alert ? (
                        <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                            <Alert.Heading>Unable to edit</Alert.Heading>
                            <p>Enter correct details</p>
                        </Alert>
                    ) : (
                            ""
                        )}

                    {successMsg ? (
                        <Alert variant="success" onClose={() => setSuccessMsg(false)} dismissible>
                            <Alert.Heading>Updated successfully</Alert.Heading>
                            <p>We have mailed the following to the {type} you just updated.</p>
                            <p>ID: {entityData.ID} <hr></hr> Created At: {entityData.UpdatedAt}</p>
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

export default EditEntity;
