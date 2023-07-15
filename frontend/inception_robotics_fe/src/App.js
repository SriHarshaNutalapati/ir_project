import logo from './logo.svg';
import './App.css';
import IRNavbar from './components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from "react";
import UserSignIn from './components/UserSignIn'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import UserSignUp from './components/UserSignUp';
import { AuthProvider, useAuth } from './authUtils/authContext';
import IRHome from './components/IRHome';
import RequireAuth from './authUtils/requireAuth';
import RobotDetail from './components/RobotDetail';
import MakeADrone from './components/MakeADrone';
import Homepage from './components/Homepage';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function App() {

  const auth = useAuth();
  console.log(auth.user);
  return (
      <>
        <IRNavbar />
        <Routes>
          {!auth.user && <Route path='/' element={<UserSignIn />} />}
          {auth.user && <Route path='/' element={<Homepage />} />}
          <Route path='/robots' element={<IRHome />} />
          <Route path='/signup' element={<UserSignUp />} />
          <Route path='/robotDetail/:id' element={<RobotDetail />} />
          {auth.user && <Route path='/makeDrone' element={<MakeADrone userid={auth.user.id}/>} />}
        </Routes>
      </>
  );
}

export default App;
