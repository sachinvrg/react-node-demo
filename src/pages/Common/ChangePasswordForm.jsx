import React from "react";
import { Form, Icon, Input, Button, notification } from "antd";
import { authService } from "../../services/AuthService";
import { UserContext } from "../../contexts/user-context";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

class ChangePasswordForm extends React.Component {
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
          .changePassword(values)
          .then(({ msg }) => {
            notification.success({ message: msg });
            this.props.onSuccess();
            this.setState({ loading: false });
            this.props.form.resetFields();
          })
          .catch(err => {
            this.setState({ loading: false });
          });
      }
    });
  };

  resetForm = () => {
    this.props.form.resetFields();
  };

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Current Password">
          {getFieldDecorator("currentPassword", {
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
            />
          )}
        </Form.Item>
        <Form.Item label="New Password">
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
            />
          )}
        </Form.Item>
        <Form.Item label="Confirm Password">
          {getFieldDecorator("confirmPassword", {
            rules: [
              { required: true, message: "Please input your Password!" },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input.Password
              prefix={<Icon type="lock" />}
              type="password"
              allowClear
            />
          )}
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
            loading={this.state.loading}
            style={{ marginRight: 10 }}
          >
            Change
          </Button>
          <Button type="default" onClick={this.resetForm}>
            Reset
          </Button>
        </div>
      </Form>
    );
  }
}

export default Form.create({ name: "change_password_form" })(
  ChangePasswordForm
);

ChangePasswordForm.contextType = UserContext;
