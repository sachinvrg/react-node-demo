import React from "react";
import { Layout, Card } from "antd";
import RegisterForm from "./RegisterForm";
import logo from "./../../logo.svg";

const { Content } = Layout;

class Register extends React.Component {
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
          <Card title="Register" style={{ width: 400 }}>
            <RegisterForm></RegisterForm>
          </Card>
        </Content>
      </Layout>
    );
  }
}

export default Register;
