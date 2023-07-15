import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useAuth } from "../authUtils/authContext";
import { useParams } from 'react-router-dom';
import IRButton from "./Button";
import Input from "./Input";
import { Excalidraw, MainMenu, serializeAsJSON  } from "@excalidraw/excalidraw";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const MakeADrone = (props) => {
    const auth = useAuth();
    const [droneDetails, setDroneDetails] = useState({});
    const [addEnabled, isAddEnabled] = useState(false);

    const canvasRef = useRef(null);

    useEffect(() => {
        const url = auth.baseURL + `/api/getDrone/${props.userid}`
        const getDrone = async() => {
            const response = await axios.get(url,
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                setDroneDetails(res.data.length?res.data[0]:{});
                setTimeout(() => {
                    if(res.data.length){
                        const fullData = JSON.parse(res.data[0].circuit_diagram);
                        const sceneData = {"elements": [], "appState": {}}
                        sceneData.elements = fullData.elements;
                        sceneData.appState = fullData.appState;
                        if(canvasRef.current) canvasRef.current.updateScene(fullData);
                    }
                }, 0);
            }
        }
        getDrone();
    }, []);

    const addDroneClicked = () => {
        isAddEnabled(true);
    }

    const saveDrone = () => {
        const drone_name = document.getElementsByClassName("drone_name_form")[0].value;
        const drone_details = document.getElementsByClassName("drone_details_form")[0].value;
        let elements = canvasRef.current.getSceneElements();
        let appState = canvasRef.current.getAppState();
        let circuit_diagram = serializeAsJSON(elements, appState, {}, "database");

        const url = auth.baseURL + `/api/saveDrone`
        const getDrone = async() => {
            const response = await axios.post(url,
                {
                    "circuit_diagram": circuit_diagram,
                    "name": drone_name,
                    "drone_details": drone_details,
                    "dronePresent": false
                },
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 201){
                setDroneDetails(res.data);
            }
        }
        getDrone();
    }

    const saveEditedDrone = () => {
        let elements = canvasRef.current.getSceneElements();
        let appState = canvasRef.current.getAppState();
        let circuit_diagram = serializeAsJSON(elements, appState, {}, "database");

        const url = auth.baseURL + `/api/saveDrone`
        const saveEditedDrone = async() => {
            const response = await axios.post(url,
                {
                    "circuit_diagram": circuit_diagram,
                    "dronePresent": true
                },
                {withCredentials: true}
            );
        }
        saveEditedDrone();
    }

    return (
        <div className="container-fluid make_a_drone_cont">
            {Object.keys(droneDetails).length == 0 && !addEnabled && (
                <IRButton variant="success" classnames="drone_add_btn" buttonLabel="Add Drone" onClick={addDroneClicked}></IRButton>
            )}

            {Object.keys(droneDetails).length == 0 && addEnabled && (
                <> 
                    <Input
                        classnames = "drone_name_form"
                        label="Drone Name"
                        name="DroneName"
                        placeholder="Enter Drone Name"
                        isLabelRequired={true}
                    ></Input>
                    <Input
                        classnames = "drone_details_form"
                        label="Drone Details"
                        name="DroneName"
                        placeholder="Enter Drone Details"
                        isLabelRequired={true}
                    ></Input>
                    <div className="excalidraw_cont">
                        <Excalidraw ref={canvasRef} />
                    </div>
                    <IRButton variant="success" classnames="drone_first_save_btn" buttonLabel="Save Drone" onClick={saveDrone}></IRButton>
                </>
            )}

            {Object.keys(droneDetails).length != 0 && (
                <>
                    <p>{`Drone Name: ${droneDetails.name}`}</p>
                    <p>{`Drone Details: ${droneDetails.drone_details}`}</p>
                    <div className="excalidraw_cont">
                        <Excalidraw ref={canvasRef} />
                    </div>
                    <IRButton variant="success" classnames="drone_save_btn" buttonLabel="Save Drone" onClick={saveEditedDrone}></IRButton>
                </>
            )}
        </div>
    )

}

export default MakeADrone;