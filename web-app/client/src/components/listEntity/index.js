import React, { useState, useEffect } from "react";
import ReactTable from "react-table";
import Modal from "react-responsive-modal";
import Rating from "react-rating";
import { Spinner, Alert } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";

const ListEntity = (props) => {
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
      Header: "Entity Id",
      accessor: "Record.ID",
      Cell: (props) => <span className="number" style={{ textAlign: "center", verticalAlign: "middle" }}>{props.value}</span>,
    },
    {
      Header: "External Id",
      accessor: "Record.ExternalID",
      Cell: (props) => <span className="number">{props.value}</span>,
    },
    {
      Header: "Type",
      accessor: "Record.Type",
      Cell: (props) => <span className="number">{props.value}</span>,
    },
    {
      Header: "Earn rate",
      accessor: "Record.EarnRate",
      Cell: (props) => <span className="number">{props.value}</span>,
    },
    {
      Header: "Tokens Info",
      accessor: "Record.TokenData",
      Cell: (props) => (
        <div>
          <button
            onClick={() => {
              setEntityTokenData(props.value);
              setOpen(true);
            }}
          >
            Token DATA
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchUserDataAction();
  }, []);

  const fetchUserDataAction = () => {
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
          <div>
            <Modal
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              center
              styles={{ width: 100 }}
              closeIconSize={20}
            >
              <div
                style={{
                  width: 200,
                  height: 60,
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 30,
                }}
              >
                <p style={{ fontWeight: "bold" }}>Total Token: {entityTokenData.Total} </p><hr></hr>
                <p style={{ fontWeight: "bold" }}>Used Token: {entityTokenData.Redeemed}</p><hr></hr>
                <p style={{ fontWeight: "bold" }}>Available Token: {entityTokenData.Available} </p><hr></hr>
                {/* <Rating
              fractions={8}
              onClick={(value) => {
                setOpen(false);
              }}
            ></Rating> */}
              </div>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListEntity;
