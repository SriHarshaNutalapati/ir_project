import React, { useRef } from "react";
import Input from "./Input";
import IRButton from "./Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authUtils/authContext";
import axios from 'axios';
import '../App.css'

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function UserSignIn(props){

    const auth = useAuth();
    const navigate = useNavigate();

    const signUpClick = () => navigate('/signup');
    const emailRef = useRef();
    const passwordRef = useRef();

    const signInClick = () => {
        const email = emailRef.current.value();
        const password = passwordRef.current.value();

        if(email && password){
            auth.login(email, password);
        }
    }

    return (
        <div className="container-fluid usersignin_form">
            <Input
                classnames = "signinform signinform_email"
                label="Email"
                name="SignInEmail"
                placeholder="Enter Email"
                type="email"
                ref={emailRef}
                isLabelRequired={true}
            ></Input>
            <Input
                classnames = "signinform signinform_password"
                label="Password"
                name="SignInPassword"
                placeholder="Enter Password"
                type="password"
                ref={passwordRef}
                isLabelRequired={true}
            ></Input>
            <IRButton variant="success" classnames="usersignin_button" buttonLabel="Sign In" onClick={signInClick}></IRButton>
            <IRButton variant="link" classnames="usersignup_button" buttonLabel="Sign Up" onClick={signUpClick}></IRButton>
        </div>
    )
}

export default UserSignIn;