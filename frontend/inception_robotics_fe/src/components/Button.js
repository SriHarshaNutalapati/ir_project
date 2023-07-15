import React from "react";
import { Button } from 'react-bootstrap';

function IRButton(props){
    return (
        <>
            <Button 
                type="button" 
                className={`ir_button ${props.classnames}`}
                onClick={props.onClick}
                variant={props.variant}
            >
                {props.children || props.buttonLabel}
            </Button>
        </>
    )
}

export default IRButton;