import React, { useState, useEffect } from "react";
import ReactTable from "react-table";
import Modal from "react-responsive-modal";
import Rating from "react-rating";
import { Spinner, Alert } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";

const ListEntityUser = (props) => {
    const { state, dispatch } = React.useContext(props.store);
    console.log("state in home page", state);
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(true);
    const [id, setid] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [entityList, setEntityList] = useState([]);
    const [entityTokenData, setEntityTokenData] = useState([]);

    const columns = [
        {
            Header: "Entity User Id",
            accessor: "Record.ID",
            Cell: (props) => <span className="number" style={{ textAlign: "center", verticalAlign: "middle" }}>{props.value}</span>,
        },
        {
            Header: "Entity Id",
            accessor: "Record.EntityID",
            Cell: (props) => <span className="number">{props.value}</span>,
        },
        {
            Header: "Name",
            accessor: "Record.Name",
            Cell: (props) => <span className="number">{props.value}</span>,
        },
        {
            Header: "Email",
            accessor: "Record.Email",
            Cell: (props) => <span className="number">{props.value}</span>,
        },
        {
            Header: "Phone",
            accessor: "Record.Phone",
            Cell: (props) => <span className="number">{props.value}</span>,
        }
    ];

    useEffect(() => {
        fetchUserDataAction();
    }, []);

    const fetchUserDataAction = () => {
        let token = localStorage.getItem("token");
        fetch("http://localhost:8090/auth/users/manufacturer", {
            method: "GET",
            headers: {
                "x-access-token": token,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((results) => {
                setLoader(false);
                setLoading(false);
                return results.json();
            })
            .then((data) => {
                setEntityList(data.data);
                // return dispatch({
                //   type: "UPDATE_USER",
                //   payload: data[0],
                // });
            });
    };

    console.log("entity list", entityList);

    return (
        <div
            style={{
                display: "flex",
                backgroundColor: "white",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
            }}
        >
            {loader ? <Spinner style={{ margin: "0 auto" }} animation="border" variant="dark" /> : (
                <div>
                    <div
                        style={{
                            height: 600,
                            backgroundColor: "white",
                            display: "flex",
                            justifyContent: "center",
                            borderWidth: 1,
                            borderColor: "black",
                            marginLeft: 100,
                            marginRight: 100,
                        }}
                    >
                        <ReactTable
                            style={{
                                padding: 10,
                                width: 700,
                                marginTop: 20,
                                marginBottom: 20,
                                textAlign: "center",
                                backgroundColor: "white",
                            }}
                            data={entityList !== [] ? entityList : []}
                            columns={columns}
                            loading={loading}
                            defaultPageSize={5}

                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListEntityUser;
