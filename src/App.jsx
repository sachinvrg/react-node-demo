import React from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import StorageService from "./services/StorageService";
import { UserContext } from "./contexts/user-context";
import { mapRoutes } from "./Utils/map-routes";
import { routes } from "./routes";
import NotFound from "./pages/Errors/NotFound";

class App extends React.Component {
  updateUser = (user, cb) => {
    this.setState({ user }, cb);
    document.cookie = "X-Authorization=" + user.token + "; path=/";
  };

  state = {
    user: StorageService.getItem("user", {}),
    updateUser: this.updateUser
  };

  componentDidMount() {
    const user = StorageService.getItem("user", {});
    document.cookie = "X-Authorization=" + user.token + "; path=/";
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <Router>
          <Switch>
            {routes.map((route, key) =>
              mapRoutes({ ...route, key, user: this.state.user })
            )}
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
