import React, { useRef } from "react";
import Input from "./Input";
import IRButton from "./Button";
import axios from 'axios';
import { useAuth } from "../authUtils/authContext";
import { useNavigate } from "react-router-dom";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function UserSignUp(props){
    const baseURL = "http://localhost:8000"

    const emailRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const auth = useAuth();
    const navigate = useNavigate();

    const signUpIR = () => {
        const email = emailRef.current.value();
        const firstName = firstNameRef.current.value();
        const lastName = lastNameRef.current.value();
        const password = passwordRef.current.value();
        const confirmPassword = confirmPasswordRef.current.value();

        if(!(email || firstName || lastName || password || confirmPassword)){
            alert("One or more field missing");
            return;
        }

        if(password != confirmPassword){
            alert("Password and Confirm Password not equal");
            return;
        }

        signUp(email, firstName, lastName, password)
    }

    const signUp = (email, firstName, lastName, password) => {
        const url = baseURL + "/api/user/register"
        const IRSignUp = async() => {
            const response = await axios.post(url, 
                {
                    "email": email,
                    "password": password,
                    "first_name": firstName,
                    "last_name": lastName
                },
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 201){
                auth.login(email, password);
                navigate("/");
            }else{
                alert("Unable to create user. Please try again")
            }
        }
        IRSignUp().catch((error) => {
            alert("Unable to create user. Please try again")
        });
    }

    return (
        <div className="usersignup_form container-fluid">
            <Input
                classnames = "signupform signupform_email"
                label="Email"
                name="SignUpEmail"
                placeholder="Enter Email"
                type="email" 
                ref={emailRef}
                isLabelRequired={true}
            ></Input>
            <Input
                classnames = "signupform signupform_firstname"
                label="First Name"
                name="SignUpFirstName"
                placeholder="Enter First Name"
                ref={firstNameRef}
                isLabelRequired={true}
            ></Input>
            <Input
                classnames = "signupform signupform_lastname"
                label="Last Name"
                name="SignUpLastName"
                placeholder="Enter Last Name"
                ref={lastNameRef}
                isLabelRequired={true}
            ></Input>
            <Input
                classnames = "signupform signupform_password"
                label="Password"
                name="SignUpPassword"
                placeholder="Enter Password"
                type="password" 
                ref={passwordRef}
                isLabelRequired={true}
            ></Input>
            <Input
                classnames = "signupform signupform_confirm_password"
                label="Password"
                name="SignUpPassword"
                placeholder="Confirm Password"
                type="password" 
                ref={confirmPasswordRef}
                isLabelRequired={true}
            ></Input>
            <IRButton variant="success" classnames="createaccount_button" buttonLabel="Create Account" onClick={signUpIR}></IRButton>
        </div>
    )
}

export default UserSignUp;