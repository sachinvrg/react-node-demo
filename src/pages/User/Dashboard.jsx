import React from "react";
import { UserContext } from "../../contexts/user-context";
import { Descriptions, Button, Modal } from "antd";
import { marketService } from "../../services/MarketService";
import { authService } from "../../services/AuthService";
import { currencyFormat } from "../../Utils/helpers";

export default class UserDashboard extends React.Component {
  disconnectMarket() {
    Modal.confirm({
      title: "Are you sure?",
      content: "You want to disconnect from market?",
      okText: "Yes",
      onOk: () => {
        marketService.disconnect().then(user => {
          const updatedUser = { ...user, token: this.context.user.token };
          this.context.updateUser(updatedUser);
        });
      }
    });
  }

  constructor(props) {
    super(props);
    this.authService = authService;
    this.state = {
      user: {}
    };
  }

  async getProfile() {
    this.setState({ user: await this.authService.getProfile() });
  }

  componentDidMount() {
    this.getProfile();
  }

  render() {
    const { user } = this.state;
    let availableFunds = 0;
    let totalMoneyInvested = 0;
    if (user.equity) {
      availableFunds = user.equity.available.cash;
      totalMoneyInvested = user.equity.utilised.debits;
    }
    return user.zerodha ? (
      <>
        <h1>User Dashboard</h1>
        <h2>You're connected with Zerodha</h2>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Name">
            {user.zerodha.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user.zerodha.email}
          </Descriptions.Item>
          <Descriptions.Item label="Available Funds">
            {currencyFormat(availableFunds)}
          </Descriptions.Item>
          <Descriptions.Item label="Total Money Invested">
            {currencyFormat(totalMoneyInvested)}
          </Descriptions.Item>
        </Descriptions>
        <Button type="link" onClick={this.disconnectMarket.bind(this)}>
          Disconnect from Market
        </Button>
      </>
    ) : (
      <a href="https://api.zerodha.com/market/redirect">Connect to Zerodha</a>
    );
  }
}

UserDashboard.contextType = UserContext;
