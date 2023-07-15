import '../App.css'
import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from "../authUtils/authContext";
import { useNavigate } from "react-router-dom";

function IRNavbar(props){
    const auth = useAuth();
    const navigate = useNavigate();

    const navigateToHome = () => navigate("/")

    return (
        <Navbar bg="light" data-bs-theme="light" className="ir_navbar">
            <Container>
                <Navbar.Brand onClick={navigateToHome}>
                    <img
                        src="https://inceptionrobotics.ai/wp-content/uploads/2022/08/cropped-InceptionRoboticsLogov1.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                    {auth.user &&
                        <>
                            <Nav className="me-auto">
                                <Nav.Link href="/robots">Robots</Nav.Link>
                                <Nav.Link href={`/makeDrone`}>Make drone</Nav.Link>
                            </Nav>
                            <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text className='signedin_text'> Signed in as: {auth.user.full_name}</Navbar.Text>
                                <Nav.Link onClick={auth.logout} className='logout_btn'>Logout</Nav.Link>
                            </Navbar.Collapse>
                        </>
                    }
                {!auth.user && 
                    <>
                        <Navbar.Collapse className="justify-content-end">
                            <Nav.Link onClick={navigateToHome}>Login</Nav.Link>
                        </Navbar.Collapse>
                    </>
                } 
            </Container>
        </Navbar>
    )
}

export default IRNavbar;