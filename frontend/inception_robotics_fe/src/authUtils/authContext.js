import React from "react";
import { useState, useContext, createContext, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext(null);

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const baseURL = "http://localhost:8000"

    useEffect(() => {
        const url = baseURL + "/api/user"
        const checkLogin = async() => {
            const response = await axios.get(url,
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                setUser(res.data.user);
            }else{
                setUser(null);
            }
        }
        checkLogin().catch((error) => {
            setUser(null);
        });
    }, []);

    const login = (email, password) => {
        const url = baseURL + "/api/user/login"
        const IRLogin = async() => {
            const response = await axios.post(url, 
                {
                    "email": email,
                    "password": password
                },
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                setUser(response.data)
            }else{
                setUser(null)
            }
        }
        IRLogin().catch((error) => {
            setUser(null);
        });
    }

    const logout = () => {
        const url = baseURL + "/api/logout"
        const IRLogout = async() => {
            const response = await axios.get(url, 
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                setUser(null);
            }
        }
        IRLogout();
    }

    return (
        <AuthContext.Provider value={{user, login, logout, baseURL}}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}