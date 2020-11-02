import React from "react";

export const UserContext = React.createContext({
    user: {},
    updateUser: (user) => { this.user = user },
});
