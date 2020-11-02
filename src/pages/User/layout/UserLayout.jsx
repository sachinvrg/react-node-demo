import React, { Component } from "react";
import { Layout } from "antd";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

const { Content } = Layout;

class UserLayout extends Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout>
        <UserSidebar></UserSidebar>
        <Layout>
          <UserHeader></UserHeader>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: "calc(100vh - 112px)"
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default UserLayout;
