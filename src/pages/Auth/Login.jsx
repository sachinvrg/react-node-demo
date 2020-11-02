import React from "react";
import AuthLayout from "./Layout/AuthLayout";
import LoginForm from "./LoginForm";
import { Card } from "antd";

class Login extends React.Component {
  render() {
    return (
      <AuthLayout>
        <Card title="Login" style={{ width: 350 }}>
          <LoginForm></LoginForm>
        </Card>
      </AuthLayout>
    );
  }
}

export default Login;
