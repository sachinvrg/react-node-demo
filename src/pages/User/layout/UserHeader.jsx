import React, { Component } from "react";
import { Layout, Button, Avatar, Menu, Dropdown, Icon, Modal } from "antd";
import { authService } from "../../../services/AuthService";
import { withRouter, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { UserContext } from "../../../contexts/user-context";
import ChangePasswordForm from "../../Common/ChangePasswordForm";

const { Header } = Layout;

class UserHeader extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    visible: false
  };

  onChangedPassword = () => {
    this.closeChangePasswordModal();
  };

  openChangePasswordModal = () => {
    this.setState({ visible: true });
  };

  closeChangePasswordModal = () => {
    this.setState({ visible: false });
  };

  menu = (
    <Menu>
      <Menu.Item>
        <NavLink to="/profile">
          <Icon type="user" style={{ marginRight: 8 }} />
          Profile
        </NavLink>
      </Menu.Item>
      <Menu.Item onClick={this.openChangePasswordModal.bind(this)}>
        <Icon type="lock" style={{ marginRight: 8 }} />
        Change Password
      </Menu.Item>
      <Menu.Item onClick={this.logout.bind(this)}>
        <Icon type="logout" style={{ marginRight: 8 }} />
        Logout
      </Menu.Item>
    </Menu>
  );

  constructor(props) {
    super(props);
    this.authService = authService;
  }

  logout() {
    this.authService.logout();
    this.context.updateUser({});
    this.props.history.push("/login");
  }

  render() {
    return (
      <Header style={{ background: "#fff", padding: 0, textAlign: "right" }}>
        <Modal
          title="Change Password"
          visible={this.state.visible}
          onCancel={this.closeChangePasswordModal}
          footer={null}
        >
          <ChangePasswordForm
            onSuccess={this.onChangedPassword}
          ></ChangePasswordForm>
        </Modal>
        <UserContext.Consumer>
          {({ user }) => {
            return (
              <Dropdown
                overlay={this.menu}
                placement="bottomCenter"
                trigger={["click"]}
              >
                <Button type="link">
                  <Avatar
                    style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    {user &&
                      user.firstName &&
                      user.lastName &&
                      user.firstName.charAt(0).toUpperCase() +
                        user.lastName.charAt(0).toUpperCase()}
                  </Avatar>
                </Button>
              </Dropdown>
            );
          }}
        </UserContext.Consumer>
      </Header>
    );
  }
}

export default withRouter(UserHeader);

UserHeader.contextType = UserContext;
