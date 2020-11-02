import React, { Component } from "react";
import { Layout, Icon } from "antd";

const { Header } = Layout;

class AdminHeader extends Component {
  state = {
    collapsed: false
  };
  render() {
    return (
      <Header style={{ background: "#fff", padding: 0 }}>
        <Icon
          className="trigger"
          type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
          onClick={this.toggle}
        />
      </Header>
    );
  }
}

export default AdminHeader;
