import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { marketService } from "../../services/MarketService";
import { Spin } from "antd";
import { UserContext } from "../../contexts/user-context";

class NotFound extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  isCallback = false;

  constructor(props) {
    super(props);
    const query = Object.fromEntries(
      new URLSearchParams(this.props.location.search)
    );
    this.isCallback = this.props.match.url === "/market/callback";

    if (this.isCallback) {
      marketService.callback(query).then(user => {
        const updatedUser = { ...this.context.user, ...user };
        this.context.updateUser(updatedUser, () =>
          this.props.history.push("/dashboard")
        );
      });
    }
  }

  render() {
    return (
      <div
        style={{ padding: "24px", display: "flex", justifyContent: "center" }}
      >
        {this.isCallback ? (
          <>
            <Spin size="large" />
            <h1 style={{ marginLeft: "24px" }}>Redirecting...</h1>
          </>
        ) : (
          <h1 style={{ marginLeft: "24px" }}>Page Not Found</h1>
        )}
      </div>
    );
  }
}

export default withRouter(NotFound);

NotFound.contextType = UserContext;
