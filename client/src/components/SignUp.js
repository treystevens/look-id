import React from 'react';
import authHOC from '../hoc/auth-hoc';
import Button from './Button';
import ConfirmAction from './ConfirmAction';
import InputField from './InputField';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Auth.css';


const SignUp = (props) => {

    const { errors } = props;
    
        return(
            <div className='img-spread1  content' >
            <div className='form-content-container'>
                    <div className='form-container'>

                    
                    <form className='form' autoComplete='off' onSubmit={props.submitHandler}>
                        <h1>Sign Up</h1>

                        {props.showConfirmation &&
                        <ConfirmAction actionSuccess={props.actionSuccess} statusMessage={props.statusMessage}/>
                        }

                        <InputField label='Username:' type='text' name='username' required={true} onChange={props.usernameChange}/>
                            {errors.username && 
                                <div className='form__text--error'>{props.errors.username.msg}</div>
                            }

                        <InputField label='Password:' type='password' name='password' required={true} onChange={props.passwordChange}/>
                            {errors.password && 
                                <div className='form__text--error'>{props.errors.password.msg}</div>
                            }

                        <InputField label='Re-enter Password:' type='password' name='confirm-password' required={true} onChange={props.passwordConfirmationChange}/>
                            {errors.confirmPassword && 
                                <div className='form__text--error'>{props.errors.confirmPassword.msg}</div>
                            } 
                        
                    <div className='form__actions'>
                        <Button text='Create Account'/>
                        <Link to='/login' className='form__action'>Already have an account?</Link>
                    </div>
                </form>
                </div>
                
                </div>
            </div>
        )
}


function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username,
    };
}


export default connect(mapStateToProps)(authHOC(SignUp));