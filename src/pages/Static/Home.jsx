import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

class Home extends React.Component {
  render() {
    return (
      <Layout>
        <Layout>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: "calc(100vh - 48px)"
            }}
          >
            <h1>Welcome to Gravity Auto Trader</h1>
            <h2>
              <Link to="/login">Login</Link>
            </h2>
            <h2>
              <Link to="/register">Register</Link>
            </h2>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Home;
