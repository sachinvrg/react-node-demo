import React from "react";
import { Layout } from "antd";
import logo from "./../../../logo.svg";

const { Content } = Layout;

class AuthLayout extends React.Component {
  render() {
    return (
      <Layout
        style={{
          minHeight: "100vh"
        }}
      >
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img src={logo} alt="logo" width="150" height="150" />
        </Content>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start"
          }}
        >
          {this.props.children}
        </Content>
      </Layout>
    );
  }
}

export default AuthLayout;
