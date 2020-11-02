import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserLayout from '../pages/User/layout/UserLayout';
import AdminLayout from '../pages/Admin/layout/AdminLayout';

export function mapRoutes({ children, path, exact, component, middleware, key, user }) {
    if (children) {
        return children.map((route, key) => {
            if (path) {
                route.path = path + route.path;
            }
            if (middleware) {
                route.middleware = middleware;
            }
            return mapRoutes({ ...route, key, user })
        });
    }
    return <Route key={key} path={path} exact={exact} render={({ location }) => {
        switch (middleware) {
            case "guest":
                return (
                    user.token ? (
                        <Redirect
                            to={{
                                pathname: user.is_admin ? "/admin/dashboard" : "/dashboard",
                                state: { from: location }
                            }}
                        />
                    ) : component
                )
            case "auth":
                return (
                    user.token ? component : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
                )
            case "user":
                return (
                    (user.token && !user.is_admin) ? <UserLayout>{component}</UserLayout> : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
                )
            case "admin":
                return (
                    (user.token && user.is_admin) ? <AdminLayout>component</AdminLayout> : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
                )
            default:
                return component;
        }
    }} />
}