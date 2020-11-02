import React from 'react';
import Dashboard from './pages/User/Dashboard';
import Stocks from './pages/User/Stocks';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Home from './pages/Static/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PasswordReset from './pages/Auth/PasswordReset';
import AdminUsers from './pages/Admin/AdminUsers';
import FavoriteStocks from './pages/User/FavoriteStocks';
import Screenings from './pages/User/Screenings';
import Orders from './pages/User/Orders';
import Profile from './pages/Common/Profile';
import Positions from './pages/User/Positions';

export const routes = [
    { path: "/", exact: true, component: <Home /> },
    {
        middleware: "user",
        children: [
            { path: "/dashboard", component: <Dashboard /> },
            { path: "/market/stocks", component: <Stocks /> },
            { path: "/user/stocks", component: <FavoriteStocks /> },
            { path: "/screenings", component: <Screenings /> },
            { path: "/orders", component: <Orders /> },
            { path: "/profile", component: <Profile /> },
            { path: "/positions", component: <Positions /> },
        ]
    },
    {
        path: "/admin",
        middleware: "admin",
        children: [
            { path: "/dashboard", component: <AdminDashboard /> },
            { path: "/users", component: <AdminUsers /> },
        ]
    },
    {
        middleware: "guest",
        children: [
            { path: "/login", component: <Login /> },
            { path: "/register", component: <Register /> },
            { path: "/password/reset", component: <PasswordReset /> },
        ]
    }
];