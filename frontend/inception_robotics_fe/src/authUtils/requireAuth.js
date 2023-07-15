import React from "react";
import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";

const RequireAuth = ({children}) => {
    const auth = useAuth();

    return auth.user?children:<Navigate to="/login" replace />
}

export default RequireAuth;