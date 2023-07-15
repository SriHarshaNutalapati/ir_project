import React from "react";
import { useNavigate } from "react-router-dom";
import IRButton from "./Button";
import NiceDCVFrame from "./IFrameNICEDCV";

const Homepage = () => {

    const navigate = useNavigate();

    const robotsList = () => navigate("/robots");
    const makeADrone = () => navigate("/makeDrone");

    return (
        <>
            <div className="container-fluid homepage_container" style={{"width": "fit-content"}}>
                <h2>Welcome to Inception Robotics</h2>
                <div className="homepage_btn_container" style={{"width": "fit-content", "margin": "0 auto"}}>
                    <IRButton classnames="robot_details_page" buttonLabel="Robots" onClick={robotsList}></IRButton>
                    <IRButton variant="success" classnames="make_drone_page" buttonLabel="Make Drone" onClick={makeADrone}></IRButton>
                </div>
                {/* <NiceDCVFrame /> */}
            </div>
        </>
    )
}

export default Homepage;