import React from 'react';
import './Button.css';


const Button = (props) => {

    let btnClass = 'btn';
    if(props.addClass) btnClass += ` ${props.addClass}`;

    if(props.dummy){
        return <button type='button' className={btnClass} onClick={props.onClick}>{props.text}</button> 
    }

    return(
        <button className={btnClass}>{props.text}</button>
    )
};

export default Button;