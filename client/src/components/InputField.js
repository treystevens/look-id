import React from 'react';
import './Form.css';

const InputField = (props) => {

    let labelUse = 'form__label';
    let inputUse = 'form__field';

    if(props.search) inputUse += ' form__field--search';
    if(props.spacing) labelUse += ` form__label--${props.spacing}`;
    if(props.inputSize) inputUse += ` form__field--${props.inputSize}`;
    


    switch (props.size) {
        case 'large':
        labelUse += ' form__label--large';
            break;
        case 'med':
        labelUse += ' form__label--med';
            break;
        case 'small':
        labelUse += ' form__label--small';
            break;
        case 'search':
        labelUse += ' form__field--search';
            break;
        default:
            break;
    }


    // Manually passing classes as props
    if(props.addClass) inputUse += `  ${props.addClass}`;

    if(props.required) return(
        <label className={labelUse}>{props.label}
            <input type={props.type} placeholder={props.placeholder} name={props.name} onChange={props.onChange} required className={inputUse} value={props.value}/>
        </label>
    )

    return(
       
            <label className={labelUse}>{props.label}
                <input type={props.type} placeholder={props.placeholder} name={props.name} className={inputUse} onChange={props.onChange} value={props.value}/>
            </label>
        
    )
};

export default InputField;