import React, { useEffect, useState } from 'react';
import { Spin, Card, Avatar } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table/react-table.css'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

const CustomerDashboard = (props) => {

    const { state, dispatch } = React.useContext(props.store);
    const [loader, setLoader] = useState(true);
    const [entityData, setEntityData] = useState([]);
    const [tokenData, setTokenData] = useState([]);

    console.log('state in user home page', state);

    useEffect(() => {
        fetchUserDataAction();
    }, []
    )


    const fetchUserDataAction = () => {
        let token = localStorage.getItem('token');
        let id = localStorage.getItem('id');
        let entityType = localStorage.getItem('entity-type');
        fetch('http://localhost:8090/auth/consumer/consumer/' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
        }).then(results => {
            setLoader(false);
            return results.json();
        }).then(data => {
            setEntityData(data.data);
            setTokenData(data.data.TokenData);
            // return dispatch({
            //   type: 'UPDATE_USER',
            //   payload: data[0]
            // })

        })
    }

    return (
        loader ?
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 300 }}>
                <Spin size="large" />
            </div> :
            <div>
                {/* <div style={{ display: "flex", backgroundColor: "white", flexDirection: "column", justifyContent: "center", alignContent: "center", padding: 20 }}>
          <table style={{ borderWidth: 1, padding: 20, marginTop: 10, backgroundColor: "#cede" }}>
            <tr><th>Id</th><th>{entityData.ID}</th></tr>
            <tr><td>External ID</td><td>{entityData.ExternalID}</td></tr>
            <tr><td>Type</td><td>{entityData.Type}</td></tr>
            <tr><td>Earn rate</td><td>{entityData.EarnRate}</td></tr>
          </table>
        </div> */}
                <div style={{ display: "flex", flexDirection: "row", marginLeft: "auto", marginRight: "auto", verticalAlign: "middle", textAlign: "center" }}>
                    <Card
                        style={{ width: 250, padding: 10, margin: 20 }}
                        cover={
                            <img
                                height="250px"
                                alt="example"
                                src={require("../../assests/pg_color.png")}
                            />
                        }
                        actions={[
                            <h4>{entityData.Name}</h4>
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src={require("../../assests/pg_color.png")} />}
                            title={entityData.Email}
                            description={entityData.Phone}
                        />
                    </Card>
                    <Card
                        style={{ width: 250, padding: 10, margin: 20 }}
                        cover={
                            <img
                                alt="example"
                                src={require("../../assests/gold-token.jpeg")}
                            />
                        }
                        actions={[
                            <h2>{tokenData.Total}</h2>
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src={require("../../assests/pg_color.png")} />}
                            title="Total Tokens"
                            description="This is the description"
                        />
                    </Card>
                    <Card
                        style={{ width: 250, padding: 10, margin: 20 }}
                        cover={
                            <img
                                alt="example"
                                src={require("../../assests/gold-token.jpeg")}
                            />
                        }
                        actions={[
                            <h2>{tokenData.Redeemed}</h2>
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src={require("../../assests/pg_color.png")} />}
                            title="Used Tokens"
                            description="This is the description"
                        />
                    </Card>
                    <Card
                        style={{ width: 250, padding: 10, margin: 20 }}
                        cover={
                            <img
                                alt="example"
                                src={require("../../assests/gold-token.jpeg")}
                            />
                        }
                        actions={[
                            <h2>{tokenData.Available}</h2>
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src={require("../../assests/pg_color.png")} />}
                            title="Available Tokens"
                            description="This is the description"
                        />
                    </Card>
                </div>
            </div>


    );
}

export default CustomerDashboard;