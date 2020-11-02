import React from "react";
import { Form, Icon, Input, Button, Checkbox, Row, Col } from "antd";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { authService } from "../../services/AuthService";
import { UserContext } from "../../contexts/user-context";

class LoginForm extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.authService = authService;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.authService
          .login(values)
          .then(user => {
            this.context.updateUser(user);
          })
          .catch(err => {
            this.setState({ loading: false });
          });
      }
    });
  };

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [
              { type: "email", message: "Please input a valid email addres." },
              { required: true, message: "Please input your email!" }
            ]
          })(
            <Input
              prefix={<Icon type="user" />}
              type="email"
              placeholder="Email"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [
              { required: true, message: "Please input your Password!" },
              { min: 6 },
              { max: 30 }
            ]
          })(
            <Input.Password
              prefix={<Icon type="lock" />}
              type="password"
              allowClear
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Row type="flex">
          <Col span={12}>
            <Form.Item>
              {getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox>Remember me</Checkbox>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Link
              to="/password/reset"
              style={{ float: "right", marginTop: 10 }}
            >
              Forgot password
            </Link>
          </Col>
        </Row>
        <Button
          type="primary"
          htmlType="submit"
          disabled={this.hasErrors(getFieldsError())}
          loading={this.state.loading}
          block={true}
        >
          Log in
        </Button>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          Or <Link to="/register">register now!</Link>
        </div>
      </Form>
    );
  }
}

export default withRouter(Form.create({ name: "login_form" })(LoginForm));

LoginForm.contextType = UserContext;
