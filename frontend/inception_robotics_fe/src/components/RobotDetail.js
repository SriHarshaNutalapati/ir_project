import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../authUtils/authContext";
import { useParams } from 'react-router-dom';
import Input from "./Input";
import IRButton from "./Button";
import '../App.css'


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const RobotDetail = (props) => {

    const auth= useAuth();
    let { id } = useParams();

    const [robotDetail, setRobotDetail] = useState({});
    const [robotComments, setRobotComments] = useState([]);

    useEffect(() => {
        const url = auth.baseURL + `/api/getrobot/${id}`
        const getRobots = async() => {
            const response = await axios.get(url,
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                setRobotDetail(res.data[0]);
            }else{
                setRobotDetail({});
            }
        }
        getRobots().catch((error) => {
            setRobotDetail({});
        });

        const commentsUrl = auth.baseURL + `/api/getrobotcomments/${id}`
        const getRobotComments = async() => {
            const response = await axios.get(commentsUrl,
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 200){
                setRobotComments(res.data);
            }else{
                setRobotComments([]);
            }
        }
        getRobotComments().catch((error) => {
            setRobotComments([]);
        });
    }, []);

    const postRobotComment = () => {
        const comment = document.getElementsByClassName("robot_enter_comment")[0];
        const commentsUrl = auth.baseURL + `/api/postRobotComment`
        const getRobotComments = async() => {
            const response = await axios.post(commentsUrl,
                {
                    "comment": comment.value,
                    "robot": id,
                    "user": auth.user.id
                },
                {withCredentials: true}
            );
            const res = response;
            if(res.status == 201){
                const comments = [...robotComments, ...[res.data]]
                comment.value = ""
                setRobotComments(comments);
            }else{
                setRobotComments([]);
            }
        }
        getRobotComments().catch((error) => {
            setRobotComments([]);
        });
    }

    return (
        <div className="container-fluid robot_detail_root">
            <h3>{`Robot Name: ${robotDetail.robot_name}`}</h3>
            <div className="row">
                <div className="container-fluid" style={{display:"flex"}}>
                    <div className="col-md-6 robot_detail_img_cont">
                        <img src={robotDetail.image_url} className="img-fluid"/>
                    </div>
                    <div className="col-md-6" style={{"marginLeft": "15px", "display": "flex", "alignItems": "center"}}>
                        <div className="robot_details_cont">
                            <p><b>Width:</b> {robotDetail.robot_width}</p>
                            <p><b>Height:</b> {robotDetail.robot_height}</p>
                            <p><b>Length:</b> {robotDetail.robot_length}</p>
                            <p><b>Sensor type:</b> {robotDetail.sensor_type}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="container-fluid">
                    <h4>Comments</h4>
                    {robotComments.map(comment => {
                        return (
                            <>
                                <p className="robot_detail_comment">{comment.comment} - {comment.user_fullname}</p>
                            </>
                        )
                        
                    })}
                    <div className="robot_detail_comment_input">
                        <Input
                            classnames = "robot_enter_comment"
                            label="Comment"
                            name="RobotComment"
                            placeholder="Enter Comment"
                            isLabelRequired={false}
                        ></Input>
                        <IRButton variant="success" classnames="robot_comment_save_btn" buttonLabel="Post" onClick={postRobotComment}></IRButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RobotDetail