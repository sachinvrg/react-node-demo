import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

const { Sider } = Layout;

class UserSidebar extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    collapsed: false
  };

  render() {
    return (
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={null}
        onCollapse={null}
      >
        <div
          className="logo"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f0f2f5"
          }}
        >
          Gravity Trader
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[this.props.location.pathname]}
        >
          <Menu.Item key="/dashboard">
            <Link to="/dashboard">
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/market/stocks">
            <Link to="/market/stocks">
              <Icon type="stock" />
              <span>Stocks</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/user/stocks">
            <Link to="/user/stocks">
              <Icon type="heart" />
              <span>Favorite Stocks</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/screenings">
            <Link to="/screenings">
              <Icon type="project" />
              <span>Screenings</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/orders">
            <Link to="/orders">
              <Icon type="reconciliation" />
              <span>Orders</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/positions">
            <Link to="/positions">
              <Icon type="crown" />
              <span>Positions</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(UserSidebar);
