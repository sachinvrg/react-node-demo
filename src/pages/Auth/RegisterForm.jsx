import React from "react";
import { Form, Icon, Input, Button, Checkbox, Select, Modal } from "antd";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { authService } from "../../services/AuthService";
import { UserContext } from "../../contexts/user-context";

const { Option } = Select;

class RegisterForm extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    visible: false
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      confirmDirty: false
    };
    this.authService = authService;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.authService
          .register(values)
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

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  openTerms = () => {
    this.setState({ visible: true });
  };

  closeTerms = () => {
    this.setState({ visible: false });
  };

  acceptedTerms = () => {
    this.props.form.setFieldsValue({ accept_terms: true });
    this.closeTerms();
  };

  declineTerms = () => {
    this.props.form.setFieldsValue({ accept_terms: false });
    this.closeTerms();
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator("firstName", {
            rules: [
              { required: true, message: "Please input your first name!" }
            ]
          })(
            <Input
              prefix={<Icon type="user" />}
              type="text"
              placeholder="First Name"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("lastName", {
            rules: [{ required: true, message: "Please input your last name!" }]
          })(
            <Input
              prefix={<Icon type="user" />}
              type="text"
              placeholder="Last Name"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please input a valid email address!" }
            ]
          })(
            <Input
              prefix={<Icon type="mail" />}
              type="email"
              placeholder="Email Address"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("phone", {
            rules: [{ required: true, message: "Please input your phone!" }]
          })(
            <Input
              prefix={<Icon type="phone" />}
              addonBefore={
                <Select
                  defaultValue="+91"
                  style={{ width: 70, color: "rgba(0,0,0,0.25)" }}
                >
                  <Option value="+91">India</Option>
                </Select>
              }
              type="phone"
              placeholder="Phone Number"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [
              { required: true, message: "Please input your Password!" },
              { validator: this.validateToNextPassword },
              { min: 6 },
              { max: 30 }
            ]
          })(
            <Input.Password
              prefix={<Icon type="lock" />}
              type="password"
              allowClear
              placeholder="Enter a Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("passwordConfirmation", {
            rules: [
              { required: true, message: "Please repeat your Password!" },
              { validator: this.compareToFirstPassword }
            ]
          })(
            <Input.Password
              prefix={<Icon type="lock" />}
              type="password"
              allowClear
              placeholder="Repeat Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("accept_terms", {
            valuePropName: "checked",
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value) {
                    callback();
                  } else {
                    callback("You must accept terms & conditions!");
                  }
                }
              }
            ]
          })(
            <Checkbox>
              Accept{" "}
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={this.openTerms}
              >
                terms &amp; conditions
              </Button>
            </Checkbox>
          )}
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={this.hasErrors(getFieldsError())}
          loading={this.state.loading}
          block={true}
        >
          Register
        </Button>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          Or <Link to="/login">login now!</Link>
        </div>
        <Modal
          title="Terms and Conditions"
          visible={this.state.visible}
          onOk={this.acceptedTerms}
          okText="Accept"
          cancelText="Decline"
          onCancel={this.declineTerms}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi quo
          fugit iure, dolores amet quas iusto nostrum libero hic deleniti
          aspernatur neque? Harum amet, laudantium ipsa tempore est autem saepe.
        </Modal>
      </Form>
    );
  }
}

export default withRouter(Form.create({ name: "register_form" })(RegisterForm));

RegisterForm.contextType = UserContext;
