import React, { Component } from "react";
import { Layout } from "antd";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const { Content } = Layout;

class AdminLayout extends Component {
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
        <AdminSidebar></AdminSidebar>
        <Layout>
          <AdminHeader></AdminHeader>
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

export default AdminLayout;
