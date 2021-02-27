import React from "react";
import { Layout, Menu, Icon, Spin, Button, icons } from "antd";

import "antd/dist/antd.css";

import { Link, withRouter } from "react-router-dom";
import "./style.css";
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;
export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            entityType: '',
            isRetailer: false
        };
    }
    componentWillMount() {
        this.fetchUserDataAction();
        this.setState({ loader: false });
    }


    fetchUserDataAction = () => {
        let token = localStorage.getItem('token');
        let entityId = localStorage.getItem('entity-id');
        let entityType = localStorage.getItem('entity-type');

        fetch('http://localhost:8090/user/' + entityType + '/entities/' + entityId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
        }).then(results => {
            this.setState({ loader: false });
            return results.json();
        }).then(data => {
            this.setState({ entityType: data.data.Type });
            if (this.state.entityType === 'manufacturer'
                || this.state.entityType === 'wholesaler'
                || this.state.entityType === 'distributor') {
                this.setState({ isRetailer: false });
            } else if (this.state.entityType === 'retailer') {
                this.setState({ isRetailer: true });
            }
            console.log('latest', this.state.entityType)
                ;            // return dispatch({
            //   type: 'UPDATE_USER',
            //   payload: data[0]
            // })

        })
    }

    render() {
        console.log("in user page", this.props);
        const Subcomponent = this.props.subComponent;
        const store = this.props.store;
        let defaultkeyselected = ["1", "2", "3"];
        let defaultopenkeys = ["sub1", "sub2"];
        let index = 0;
        if (Subcomponent.name === "Dashboard") index = 1;
        else if (Subcomponent.name === "GrantToken") index = 2;
        else if (Subcomponent.name === "Logout") index = 3;

        return (
            <div style={{ backgroundColor: "white" }}>
                <Layout>
                    <Sider
                        style={{ width: "150", backgroundColor: "#0663ac", marginBottom: 0 }}
                    >
                        <img
                            width="200px"
                            style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                textAlign: "center",
                                verticalAlign: "middle",
                            }}
                            src={require("../../assests/pg_color.png")}
                        />
                        <Menu
                            defaultSelectedKeys={[defaultkeyselected[5]]}
                            defaultOpenKeys={[defaultopenkeys[index]]}
                            style={{ backgroundColor: "#0663ac", color: "white" }}
                        >
                            <Menu.Item key="1" icon={<PieChartOutlined style={{ backgroundColor: "red" }} />}>
                                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/user">
                                    Dashboard
                                </Link>
                            </Menu.Item>

                            {
                                !this.state.isRetailer
                                    ?
                                    <Menu.Item key="2" icon={<DesktopOutlined />}>
                                        <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/entity/grant-token">
                                            Grant Tokens
                                        </Link>
                                    </Menu.Item>
                                    : ''
                            }

                            {
                                this.state.isRetailer
                                    ?
                                    <Menu.Item key="2" icon={<DesktopOutlined />}>
                                        <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/consumer/grant-token">
                                            Grant Tokens
                                        </Link>
                                    </Menu.Item>
                                    : ''
                            }


                            {
                                this.state.isRetailer
                                    ?
                                    <Menu.Item key="4" icon={<DesktopOutlined />}>
                                        <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/consumer/redeem-token">
                                            Redeem Tokens
                                        </Link>
                                    </Menu.Item>
                                    : ''
                            }

                            {
                                this.state.isRetailer
                                    ?
                                    <Menu.Item key="5" icon={<DesktopOutlined />}>
                                        <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/consumer/create">
                                            Create Consumer
                                        </Link>
                                    </Menu.Item>
                                    : ''
                            }

                            {
                                this.state.isRetailer
                                    ?
                                    <Menu.Item key="6" icon={<DesktopOutlined />}>
                                        <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/consumer/edit">
                                            Edit Consumer
                                        </Link>
                                    </Menu.Item>
                                    : ''
                            }

                            {
                                this.state.isRetailer
                                    ?

                                    <Menu.Item key="7" icon={<DesktopOutlined />}>
                                        <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/consumer/list">
                                            List Consumer
                                        </Link>
                                    </Menu.Item>
                                    : ''
                            }
                            <Menu.Item key="8" style={{ backgroundColor: "#0663ac" }}>
                                {" "}
                                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/logout">
                                    Logout
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ height: 100, backgroundColor: "white" }}>
                            <h1 style={{ color: "black", textAlign: "center" }}>
                                P&G Loyalty Platform - User Portal
              </h1>
                        </Header>
                        <Content height="100%" style={{ backgroundColor: "white", height:"100%" }}><h3 style={{ textAlign: "center", backgroundColor: "blue", color: "white" }}>{this.props.title}</h3><Subcomponent store={store} ></Subcomponent></Content>
                        <Footer style={{ height: 10, backgroundColor: "#0663ac" }}>
                            <h6 style={{ color: "white", textAlign: "center" }}>
                                Copyright @ P&G Loyalty Platforn
              </h6>
                        </Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}
