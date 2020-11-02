import React from "react";
import { Form, Icon, Input, Button, Select, Card } from "antd";
import { UserContext } from "../../contexts/user-context";
import { withRouter } from "react-router-dom";
import { authService } from "../../services/AuthService";

const { Option } = Select;

class Profile extends React.Component {
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
          .updateProfile(values)
          .then(user => {
            this.context.updateUser(user);
          })
          .catch(err => {
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
      <Card
        title="Profile Information"
        style={{ width: "50%", margin: "auto" }}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("firstName", {
              rules: [
                { required: true, message: "Please input your first name!" }
              ],
              initialValue: this.context.user.firstName
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
              rules: [
                { required: true, message: "Please input your last name!" }
              ],
              initialValue: this.context.user.lastName
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
                {
                  type: "email",
                  message: "Please input a valid email address!"
                }
              ],
              initialValue: this.context.user.email
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
              rules: [{ required: true, message: "Please input your phone!" }],
              initialValue: this.context.user.phone
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

          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
            loading={this.state.loading}
            block={true}
          >
            Update
          </Button>
        </Form>
      </Card>
    );
  }
}

export default withRouter(Form.create({ name: "profile_form" })(Profile));

Profile.contextType = UserContext;
