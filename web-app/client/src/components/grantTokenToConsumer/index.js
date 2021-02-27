import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";

const GrantTokenToConsumer = (props) => {
    const { state, dispatch } = React.useContext(props.store);
    console.log("state in create entity page", state);
    const [alert, setAlert] = useState(false);
    const [loader, setLoader] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [externalId, setExternalId] = useState();
    const [amount, setAmount] = useState();
    const [entityList, setEntityList] = useState([]);
    const [currentGrantId, setCurrentGrantId] = useState();
    const [currentGrantIdData, setCurrentGrantIdData] = useState([]);
    const [currentTakeId, setCurrentTakeId] = useState();
    const [currentTakeIdData, setCurrentTakeIdData] = useState([]);
    const [transaction, setTransaction] = useState([]);
    const [listItems, setListItems] = useState([]);

    useEffect(() => {
        fetchEntityDataAction();
    }, []);

    const fetchEntityDataAction = () => {
        let token = localStorage.getItem("token");
        fetch("http://localhost:8090/auth/consumers/middlemen", {
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
                console.log('fghb', data.data);
                let grantId = localStorage.getItem("entity-id");
                setCurrentGrantId(grantId);
                console.log('fghb1', currentGrantId);
                // let currentData = [];
                // let entity;
                // for (entity of data.data) {
                //     console.log('chk', entity.Key);
                //     if (entity.Key === grantId) {
                //         currentData = entity.Record;
                //         break;
                //     }
                // }
                // setCurrentGrantIdData(currentData);
                // console.log('magic', currentData);
                let x = data.data.map((entity) =>
                    <option value={entity.Key} key={entity.Key}> {entity.Key} </option>
                )
                setListItems(x);
                console.log('list-items', listItems);
            });
    };


    const grantTokenToConsumer = () => {
        let token = localStorage.getItem('token');
        let url = "http://localhost:8090/token/grant-token/consumer/middlemen";
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({
                paymentId: externalId,
                amount: amount,
                tokenGrantEntityId: currentGrantId,
                consumerId: currentTakeId
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
                    setTransaction(data.data);
                    props.history.push("/consumer/grant-token");
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
                                grantTokenToConsumer();
                                event.preventDefault();
                            }}
                            style={{ padding: 20 }}
                        >
                            <Form.Group controlId="formBasicGrantId">
                                <Form.Label style={{ color: "white" }}>Token Grant ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={currentGrantId}
                                    readOnly
                                    value={currentGrantId}
                                />
                            </Form.Group>


                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label style={{ color: "white" }}>Select the consumer</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={(event) => {
                                        setCurrentTakeId(event.target.value);
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
                                        setCurrentTakeIdData(currentData);
                                        console.log('magic', currentData);
                                    }}
                                >
                                    <option value={-1} key={-1}> Select </option>
                                    {listItems}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formBasicExternalId">
                                <Form.Label style={{ color: "white" }}>External Payment ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter the external id"
                                    onChange={(event) => {
                                        setExternalId(event.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicAmount">
                                <Form.Label style={{ color: "white" }}>Amount</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter the amount"
                                    onChange={(event) => {
                                        setAmount(event.target.value);
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
                            <Alert.Heading>Transaction failed</Alert.Heading>
                            <p>Please try again.</p>
                        </Alert>
                    ) : (
                            ""
                        )}

                    {successMsg ? (
                        <Alert variant="success" onClose={() => setSuccessMsg(false)} dismissible>
                            <Alert.Heading>Transaction successful</Alert.Heading>
                            <p>ID: {transaction.ID} <hr></hr> Created At: {transaction.Timestamp}</p>
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

export default GrantTokenToConsumer;
