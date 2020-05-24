import React from 'react';
import { Layout, Menu, Icon, Spin } from 'antd';
import 'antd/es/layout/style/index.css';
import 'antd/es/menu/style/index.css';
import 'antd/es/breadcrumb/style/index.css';
import 'antd/es/icon/style/index.css';
import 'antd/es/spin/style/index.css';
import { Link } from "react-router-dom";
import './style.css';


const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
export default class LayoutPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loader:true
        }
    }
    componentWillMount() {
        this.setState({loader:false});
    }
    render() {
        console.log('in layout', this.props)
        const Subcomponent = this.props.subComponent;
        const store = this.props.store;
        let defaultkeyselected = ['1', '2', '3', '4', '5'];
        let defaultopenkeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5'];
        let index = 0;
        if (Subcomponent.name === 'MovieTable')
            index = 1;
        else if (Subcomponent.name === 'MovieForm')
            index = 2;
        else if (Subcomponent.name === 'FriendList')
            index = 3;

        return (
            this.state.loader ? 
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' , marginTop:200 }}>
        <Spin size="large" />
      </div>
      :
            <div style={{ flex: 1, textAlign: "center" }}>
                <Layout>
                    <Header className="header" style={{ color: "white" }}>

                        <h3 style={{ marginTop: 10 }}>Movie Reviews</h3>
                    </Header>
                    <Content style={{ padding: '0 50px' }}>

                        <Layout style={{ padding: '24px 0', background: '#fff' }}>
                            <Sider width={200} style={{ background: '#fff', height: 600 }}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={[defaultkeyselected[index]]}
                                    defaultOpenKeys={[defaultopenkeys[index]]}
                                    style={{ height: '100%' }}
                                >
                                    <SubMenu
                                        key="sub1"
                                        title={
                                            <span>
                                                <Icon type="user" />
                                                How's you?
                </span>
                                        }
                                    >
                                        <Menu.Item key="1"><Link style={{ textDecoration: "none" }} to='/'>Profile</Link></Menu.Item>

                                    </SubMenu>

                                    <SubMenu
                                        key="sub2"
                                        title={
                                            <span>
                                                <Icon type="user" />
                                                Gallery
                </span>
                                        }
                                    >
                                        <Menu.Item key="2"><Link style={{ textDecoration: "none" }} to='/movies'>Movies</Link></Menu.Item>

                                    </SubMenu>
                                    <SubMenu
                                        key="sub3"
                                        title={
                                            <span>
                                                <Icon type="laptop" />
                                                Add movie
                </span>
                                        }
                                    >
                                        <Menu.Item key="3"><Link style={{ textDecoration: "none" }} to='/add-movie'>Click Here</Link></Menu.Item>

                                    </SubMenu>
                                    <SubMenu
                                        key="sub4"
                                        title={
                                            <span>
                                                <Icon type="user" />
                                                Bingers
                </span>
                                        }
                                    >
                                        <Menu.Item key="4"><Link style={{ textDecoration: "none" }} to='/friend-list'>Current Friends</Link></Menu.Item>

                                    </SubMenu>

                                     <SubMenu
                                        key="sub5"
                                        title={
                                            <span>
                                                <Icon type="user" />
                                                Add Friends
                </span>
                                        }
                                    >
                                        <Menu.Item key="5"><Link style={{ textDecoration: "none" }} to='/add-friend'>Click here</Link></Menu.Item>

                                    </SubMenu>
                                    <SubMenu
                                        key="sub6"
                                        title={
                                            <span>
                                                <Icon type="logout" />
                                                Logout
                </span>
                                        }
                                    >
                                        <Menu.Item key="6"><Link to='/login' onClick={() => { localStorage.removeItem('token') }}>Logout</Link></Menu.Item>

                                    </SubMenu>

                                </Menu>
                            </Sider>
                            <Content style={{  minHeight: 280 }}>{this.props.title}<Subcomponent store={store} ></Subcomponent></Content>
                        </Layout>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}> Movie Reviews @ 2019</Footer>
                </Layout>
            </div>

        );
    }
}

