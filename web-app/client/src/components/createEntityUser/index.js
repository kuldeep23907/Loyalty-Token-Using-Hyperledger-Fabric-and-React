import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";

const CreateEntityUser = (props) => {
    const { state, dispatch } = React.useContext(props.store);
    console.log("state in create entity page", state);
    const [alert, setAlert] = useState(false);
    const [loader, setLoader] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [entityId, setEntityId] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();
    const [entityUserData, setEntityUserData] = useState([]);
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

    const addEntityUser = () => {
        let token = localStorage.getItem('token');
        let entityType = currentIdData.Type;
        let toPost = entityType === 'wholesaler'
            || entityType === 'retailer'
            || entityType === 'distributor'
            ? 'middlemen' : 'manufacturer';
        let url = "http://localhost:8090/auth/users/" + toPost;
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({
                entityId: currentIdData.ID,
                name: name,
                email: email,
                phone: phone,
                password: password,
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
                    setEntityUserData(data.data);
                    props.history.push("/entity-user/create");
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
                                addEntityUser();
                                event.preventDefault();
                            }}
                            style={{ padding: 20 }}
                        >
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label style={{ color: "white" }}>Select Entity for User</Form.Label>
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
                                    <option value={-1} key={-1}> Select </option>
                                    {listItems}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formBasicExternalId">
                                <Form.Label style={{ color: "white" }}>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter User Name"
                                    onChange={(event) => {
                                        setName(event.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{ color: "white" }}>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email"
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPhone">
                                <Form.Label style={{ color: "white" }}>Phone</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Phone"
                                    onChange={(event) => {
                                        setPhone(event.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label style={{ color: "white" }}> Password </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter the password"
                                    onChange={(event) => {
                                        setPassword(event.target.value);
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
                            <Alert.Heading>Unable to register</Alert.Heading>
                            <p>Enter correct details</p>
                        </Alert>
                    ) : (
                            ""
                        )}

                    {successMsg ? (
                        <Alert variant="success" onClose={() => setSuccessMsg(false)} dismissible>
                            <Alert.Heading>Entity User registered successfully</Alert.Heading>
                            <p>We have mailed the following to User: {name} you just registered.</p>
                            <p>ID: {entityUserData.ID} <hr></hr> Created At: {entityUserData.CreatedAt}</p>
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

export default CreateEntityUser;
