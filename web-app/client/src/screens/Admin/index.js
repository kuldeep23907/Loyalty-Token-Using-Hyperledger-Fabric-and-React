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
export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
    };
  }
  componentWillMount() {
    this.setState({ loader: false });
  }

  render() {
    console.log("in admin page", this.props);
    const Subcomponent = this.props.subComponent;
    const store = this.props.store;
    let defaultkeyselected = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    let defaultopenkeys = ["sub1", "sub2"];
    let index = 1;
    if (Subcomponent.name === "Dashboard") index = 1;
    else if (Subcomponent.name === "Consumer") index = 2;
    else if (Subcomponent.name === "CreateEntity") index = 3;
    else if (Subcomponent.name === "UpdateEntity") index = 4;
    else if (Subcomponent.name === "ListEntity") index = 5;
    else if (Subcomponent.name === "CreateEntityUser") index = 6;
    else if (Subcomponent.name === "UpdateEntityUser") index = 7;
    else if (Subcomponent.name === "ListEntityUser") index = 8;
    else if (Subcomponent.name === "Logout") index = 9;

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
              defaultSelectedKeys={[defaultkeyselected[index]]}
              style={{ backgroundColor: "#0663ac", color: "white" }}
            >
              <Menu.Item key="1" icon={<PieChartOutlined style={{ backgroundColor: "red" }} />}>
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/admin">
                  Dashboard
                  </Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />}>
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/consumers-list">
                  Consumers
                  </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/entity/create">
                  Create Entiry
                    </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/entity/edit">
                  Update Entity
                    </Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/entity/list">
                  List Entity
                    </Link>
              </Menu.Item>
              <Menu.Item key="6" >
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/entity-user/create">
                  Create User
                    </Link>
              </Menu.Item>
              <Menu.Item key="7" >
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/entity-user/edit">
                  Update User
                    </Link>
              </Menu.Item>
              <Menu.Item key="8" >
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/entity-user/list">
                  List Users
                    </Link>
              </Menu.Item>
              <Menu.Item key="9" >
                <Link style={{ textDecoration: "none", color: "white", textAlign: "center" }} to="/logout">
                  Logout
                    </Link>
              </Menu.Item>

            </Menu>
          </Sider>
          <Layout>
            <Header style={{ height: 100, backgroundColor: "white" }}>
              <h1 style={{ color: "black", textAlign: "center" }}>
                P&G Loyalty Platform - Admin Portal
              </h1>
            </Header>
            <Content style={{ backgroundColor: "white",height:"100%" }}><h3 style={{ textAlign: "center", backgroundColor: "blue", color: "white" }}>{this.props.title}</h3><Subcomponent store={store} ></Subcomponent></Content>
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
