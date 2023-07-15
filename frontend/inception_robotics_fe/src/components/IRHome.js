import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../authUtils/authContext";
import Table from 'react-bootstrap/Table';
import IRButton from "./Button";
import Input from "./Input";
import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faSave, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const IRHome = (props) => {

    const [addEnabled, setAddEnabled] = useState(false);
    const [editEnabled, setEditEnabled] = useState([]);

    const auth = useAuth();

    const [robots, setRobots] = useState([]);

    useEffect(() => {
        const url = auth.baseURL + "/api/robots"
        const getRobots = async() => {
            const response = await axios.get(url,
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                setRobots(res.data);
            }else{
                setRobots([]);
            }
        }
        getRobots().catch((error) => {
            setRobots([]);
        });
    }, []);

    const addBtnClicked = () => setAddEnabled(!addEnabled);

    const addRobot = () => {
        const robot_name = document.getElementsByClassName("robotadd_form_name")[0];
        const robot_width = document.getElementsByClassName("robotadd_form_width")[0];
        const robot_length = document.getElementsByClassName("robotadd_form_length")[0];
        const robot_height = document.getElementsByClassName("robotadd_form_height")[0];
        const robot_sensor_type = document.getElementsByClassName("robotadd_form_sensor_type")[0];
        const robot_image_url = document.getElementsByClassName("robotadd_form_image_url")[0];
        
        if(!(robot_name.value || robot_width.value || robot_length.value || robot_height.value || robot_sensor_type.value || robot_image_url.value)){
            alert("One or more fields left blank");
            return;
        }

        const url = auth.baseURL + "/api/addrobot"
        const addRobotToDB = async() => {
            const response = await axios.post(url,
                {
                    "robot_name": robot_name.value,
                    "robot_width": robot_width.value,
                    "robot_height": robot_height.value,
                    "robot_length": robot_length.value,
                    "sensor_type": robot_sensor_type.value,
                    "image_url": robot_image_url.value
                },
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 201){
                robot_name.value = '';
                robot_width.value = '';
                robot_length.value = '';
                robot_height.value = '';
                robot_sensor_type.value = '';
                robot_image_url.value = '';
                setRobots([...robots, ...[res.data]]);
            }
        }

        addRobotToDB();
    }

    const editRobot = (robot_id) => {
        const editableRobots = [...editEnabled, ...[robot_id]];
        setEditEnabled(editableRobots);
    }

    const cancelEdit = (robot_id) => {
        const arr = editEnabled.filter(id => id !== robot_id);
        setEditEnabled(arr);
    }

    const saveEditedRobot = (robot_id) => {
        const robot_name = document.getElementsByClassName(`robot_edit_form_name_${robot_id}`)[0];
        const robot_width = document.getElementsByClassName(`robot_edit_form_width_${robot_id}`)[0];
        const robot_length = document.getElementsByClassName(`robot_edit_form_length_${robot_id}`)[0];
        const robot_height = document.getElementsByClassName(`robot_edit_form_height_${robot_id}`)[0];
        const robot_sensor_type = document.getElementsByClassName(`robot_edit_form_sensor_type_${robot_id}`)[0];
        const robot_image_url = document.getElementsByClassName(`robot_edit_form_url_${robot_id}`)[0];

        if(!(robot_name.value || robot_width.value || robot_length.value || robot_height.value || robot_sensor_type.value || robot_image_url.value)){
            alert("One or more fields left blank");
            return;
        }

        const url = auth.baseURL + `/api/editrobot/${robot_id}/`
        const addEditedRobotToDB = async() => {
            const response = await axios.post(url,
                {
                    "robot_name": robot_name.value,
                    "robot_width": robot_width.value,
                    "robot_height": robot_height.value,
                    "robot_length": robot_length.value,
                    "sensor_type": robot_sensor_type.value,
                    "image_url": robot_image_url.value
                },
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                const robots_arr = robots.filter(robot => robot.id != robot_id)
                robot_name.value = '';
                robot_width.value = '';
                robot_length.value = '';
                robot_height.value = '';
                robot_sensor_type.value = '';
                robot_image_url.value = '';
                setRobots([...robots_arr, ...res.data]);
                const arr = editEnabled.filter(id => id !== robot_id);
                setEditEnabled(arr);
            }
        }

        addEditedRobotToDB();
    }

    const deleteRobot = (robot_id) => {

        const url = auth.baseURL + `/api/deleterobot/${robot_id}/`
        const deleteSelectedRobot = async() => {
            const response = await axios.post(url,
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                const robots_arr = robots.filter(robot => robot.id != robot_id)
                setRobots(robots_arr);
            }
        }

        deleteSelectedRobot();
    }

    return (
        <div className="container-fluid robots_home_page">
            {auth.user && auth.user["is_staff"] && <IRButton variant="success" classnames="robot_add_btn" buttonLabel={addEnabled?"Cancel Add Robot":"Add Robot"} onClick={addBtnClicked}></IRButton>}
            <Table striped bordered hover size="sm" className="robot_detail_table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Width</th>
                        <th>Length</th>
                        <th>Height</th>
                        <th>Sensor Type</th>
                        <th>Image URL</th>
                        {auth.user && auth.user["is_staff"] && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {robots.map(robot => {
                        return (
                            <tr>
                                {editEnabled.includes(robot["id"]) && (
                                    <>
                                        <td>
                                            <Input
                                                classnames = {`robotedit_form robotedit_form_name robot_edit_form_name_${robot["id"]}`}
                                                label="Robot Name"
                                                name="RobotName"
                                                placeholder="Robot Name"
                                                isLabelRequired={false}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                classnames = {`robotedit_form robotedit_form_width robot_edit_form_width_${robot["id"]}`}
                                                label="Robot Width"
                                                name="RobotWidth"
                                                placeholder="Robot Width"
                                                type="number"
                                                isLabelRequired={false}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                classnames = {`robotedit_form robotedit_form_length robot_edit_form_length_${robot["id"]}`}
                                                label="Robot Length"
                                                name="RobotLength"
                                                placeholder="Robot Length"
                                                type="number"
                                                isLabelRequired={false}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                classnames = {`robotedit_form robotedit_form_height robot_edit_form_height_${robot["id"]}`}
                                                label="Robot Height"
                                                name="RobotHeight"
                                                placeholder="Robot Height"
                                                type="number"
                                                isLabelRequired={false}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                classnames = {`robotedit_form robotedit_form_sensor_type robot_edit_form_sensor_type_${robot["id"]}`}
                                                label="Robot SensorType"
                                                name="RobotSensorType"
                                                placeholder="Robot SensorType"
                                                isLabelRequired={false}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                classnames = {`robotedit_form robotedit_form_image_url robot_edit_form_url_${robot["id"]}`}
                                                label="Robot Image URL"
                                                name="RobotImage URL"
                                                placeholder="Robot Image URL"
                                                isLabelRequired={false}
                                            ></Input>
                                        </td>
                                        {auth.user && auth.user["is_staff"] && (
                                            <>
                                                <td style={{"width": "15%"}}>
                                                    <IRButton variant="success" classnames="robot_save_edit_btn" buttonLabel="Save" onClick={() => saveEditedRobot(robot["id"])}>
                                                        <FontAwesomeIcon icon={faSave} />
                                                    </IRButton>
                                                    <IRButton variant="danger" classnames="robot_cancel_edit_btn" buttonLabel="Cancel" onClick={() => cancelEdit(robot["id"])}>
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </IRButton>
                                                </td>
                                            </>
                                        )}
                                    </>
                                )}
                                {!editEnabled.includes(robot["id"]) && (
                                    <>
                                        <td><a href={`/robotDetail/${robot["id"]}`}>{robot["robot_name"]}</a></td>
                                        <td>{robot["robot_width"]}</td>
                                        <td>{robot["robot_length"]}</td>
                                        <td>{robot["robot_height"]}</td>
                                        <td>{robot["sensor_type"]}</td>
                                        <td>{robot["image_url"]}</td>
                                        {auth.user && auth.user["is_staff"] && (
                                            <>
                                                <td style={{"width": "15%"}}>
                                                    <IRButton variant="primary" classnames="robot_edit_btn" buttonLabel="Edit" onClick={() => editRobot(robot["id"])}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </IRButton>
                                                    <IRButton variant="danger" classnames="robot_delete_btn" buttonLabel="Delete" onClick={() => deleteRobot(robot["id"])}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </IRButton>
                                                </td>
                                            </>
                                        )}
                                    </>
                                )}
                                
                            </tr>
                        )
                    })}
                    {addEnabled && (
                        <tr>
                            <td>
                                <Input
                                    classnames = "robotadd_form robotadd_form_name"
                                    label="Robot Name"
                                    name="RobotName"
                                    placeholder="Robot Name"
                                    isLabelRequired={false}
                                ></Input>
                            </td>
                            <td>
                                <Input
                                    classnames = "robotadd_form robotadd_form_width"
                                    label="Robot Width"
                                    name="RobotWidth"
                                    placeholder="Robot Width"
                                    type="number"
                                    isLabelRequired={false}
                                ></Input>
                            </td>
                            <td>
                                <Input
                                    classnames = "robotadd_form robotadd_form_length"
                                    label="Robot Length"
                                    name="RobotLength"
                                    placeholder="Robot Length"
                                    type="number"
                                    isLabelRequired={false}
                                ></Input>
                            </td>
                            <td>
                                <Input
                                    classnames = "robotadd_form robotadd_form_height"
                                    label="Robot Height"
                                    name="RobotHeight"
                                    placeholder="Robot Height"
                                    type="number"
                                    isLabelRequired={false}
                                ></Input>
                            </td>
                            <td>
                                <Input
                                    classnames = "robotadd_form robotadd_form_sensor_type"
                                    label="Robot SensorType"
                                    name="RobotSensorType"
                                    placeholder="Robot SensorType"
                                    isLabelRequired={false}
                                ></Input>
                            </td>
                            <td>
                                <Input
                                    classnames = "robotadd_form robotadd_form_image_url"
                                    label="Robot Image URL"
                                    name="RobotImage URL"
                                    placeholder="Robot Image URL"
                                    isLabelRequired={false}
                                ></Input>
                            </td>
                            <td>
                                <IRButton variant="success" classnames="robot_add_cell_btn btn-primary" buttonLabel="Add" onClick={addRobot}>
                                    <FontAwesomeIcon icon={faSave} />
                                </IRButton>
                            </td>

                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default IRHome;