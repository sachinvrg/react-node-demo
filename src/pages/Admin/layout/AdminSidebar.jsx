import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

class AdminSidebar extends Component {
  state = {
    collapsed: false
  };

  render() {
    return (
      <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Link to="/admin/users">
              <Icon type="user" />
              <span>Users</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default AdminSidebar;
