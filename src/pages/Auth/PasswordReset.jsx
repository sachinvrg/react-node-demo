import React from "react";
import AuthLayout from "./Layout/AuthLayout";
import { Form, Icon, Input, Button, Card } from "antd";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { authService } from "../../services/AuthService";

class PasswordReset extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    loding: false
  };

  constructor(props) {
    super(props);
    this.authService = authService;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.authService
          .forgotPassword(values)
          .then(resp => {
            this.props.history.push("/dashboard");
          })
          .finally(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <AuthLayout>
        <Card title="Forgot password?" style={{ width: 350 }}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator("email", {
                rules: [{ required: true, message: "Please input your email!" }]
              })(
                <Input
                  prefix={<Icon type="mail" />}
                  type="email"
                  placeholder="Email"
                />
              )}
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.hasErrors(getFieldsError())}
              loading={this.state.loading}
              block={true}
            >
              Get instructions
            </Button>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              Or <Link to="/login">login!</Link>
            </div>
          </Form>
        </Card>
      </AuthLayout>
    );
  }
}

export default withRouter(
  Form.create({ name: "password_reset" })(PasswordReset)
);
