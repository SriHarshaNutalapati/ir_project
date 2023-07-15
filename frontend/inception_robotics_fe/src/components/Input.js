import React, { useRef, forwardRef, useImperativeHandle } from "react";

const Input = forwardRef(function (props, ref) {
    const inputRef = useRef();

    useImperativeHandle(ref, () => {
      return {
        value(){ 
            return inputRef.current.value 
        },
      }
    }, [])

    return (
        <>
            {props.isLabelRequired && <label htmlFor={props.name}>{props.label}</label>}
            <input ref={inputRef} type={props.type || "text"} className={`ir_input form-control ${props.classnames}`} placeholder={props.placeholder || "Enter"} name={props.name}/>
        </>
    )
});

export default Input;