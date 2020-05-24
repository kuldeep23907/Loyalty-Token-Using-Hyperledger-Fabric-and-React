import React from "react";
import { Layout, Menu, Icon, Spin, Button, icons } from "antd";

import "antd/dist/antd.css";

import { Link, withRouter } from "react-router-dom";
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
export default class Consumer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            entityType: '',
            isRetailer: false
        };
    }
    componentWillMount() {
        // this.fetchUserDataAction();
        this.setState({ loader: false });
    }

    render() {
        console.log("in user page", this.props);
        const Subcomponent = this.props.subComponent;
        const store = this.props.store;
        let defaultkeyselected = ["1", "2", "3"];
        let defaultopenkeys = ["sub1", "sub2"];
        let index = 0;
        if (Subcomponent.name === "Dashboard") index = 1;
        else if (Subcomponent.name === "Transaction") index = 2;
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
                                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/consumer">
                                    Dashboard
                                </Link>
                            </Menu.Item>



                            <Menu.Item key="2" icon={<DesktopOutlined />}>
                                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/transactions">
                                    Transactions
                                        </Link>
                            </Menu.Item>

                            <Menu.Item key="3" >
                                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/logout">
                                    Logout
                                </Link>
                            </Menu.Item>

                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ height: 100, backgroundColor: "white" }}>
                            <h1 style={{ color: "black", textAlign: "center" }}>
                                P&G Loyalty Platform - Consumer Portal
              </h1>
                        </Header>
                        <Content style={{ backgroundColor: "white", height:"100%" }}><h3 style={{ textAlign: "center", backgroundColor: "blue", color: "white" }}>{this.props.title}</h3><Subcomponent store={store} ></Subcomponent></Content>
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
