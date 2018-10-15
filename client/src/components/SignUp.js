import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { addAuth } from '../actions/actions';
import { sendUserData } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';
import InputField from './InputField';
import Button from './Button';
import './Auth.css';
import authHOC from '../hoc/auth-hoc';

class SignUp extends Component{
    constructor(props){
        super(props);

    }
   
    render(){

        const { errors } = this.props;
        // Redirect once user successfully signs up
        if(this.props.isAuth){
            return <Redirect to='/'/>
        }

        return(
            
            <div className='img-spread1  content' >
            <div className='form-content-container'>
                    <div className='form-container'>

                    
                    <form className='form' autoComplete='off' onSubmit={this.props.submitHandler}>
                        <h1>Sign Up</h1>

                        {this.props.showConfirmation &&
                        <ConfirmAction actionSuccess={this.props.actionSuccess} statusMessage={this.props.statusMessage}/>
                        }

                        <InputField label='Username:' type='text' name='username' required={true} onChange={this.props.usernameChange}/>
                            {errors.username && 
                                <div className='form__text--error'>{this.props.errors.username.msg}</div>
                            }

                        <InputField label='Password:' type='password' name='password' required={true} onChange={this.props.passwordChange}/>
                            {errors.password && 
                                <div className='form__text--error'>{this.props.errors.password.msg}</div>
                            }

                        <InputField label='Re-enter Password:' type='password' name='confirm-password' required={true} onChange={this.props.passwordConfirmationChange}/>
                            {errors.confirmPassword && 
                                <div className='form__text--error'>{this.props.errors.confirmPassword.msg}</div>
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
}

function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username,
    };
}

export default authHOC(connect(mapStateToProps)(SignUp));