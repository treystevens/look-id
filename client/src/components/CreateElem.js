import React from 'react';
import './CreateElem.css';




const CreateElem = (props) => {
    let contianerClass = 'create-container';

    if(props.size) contianerClass += ` create-container--${props.size}`;

    return(
        <div className={contianerClass}>
            <div className='create__display' onClick={props.handleCreate}>
                <svg className='create__item' enableBackground="new 0 0 52 52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" ><path d="m26 0c-14.336 0-26 11.663-26 26s11.664 26 26 26 26-11.663 26-26-11.664-26-26-26zm0 50c-13.233 0-24-10.767-24-24s10.767-24 24-24 24 10.767 24 24-10.767 24-24 24z"/><path d="m38.5 25h-11.5v-11c0-.553-.448-1-1-1s-1 .447-1 1v11h-11.5c-.552 0-1 .447-1 1s.448 1 1 1h11.5v12c0 .553.448 1 1 1s1-.447 1-1v-12h11.5c.552 0 1-.447 1-1s-.448-1-1-1z"/></svg>
            </div>
            <h2 className='create__text' onClick={props.handleCreate}>{props.text}</h2>
        </div>        
    )
}


export default CreateElem;