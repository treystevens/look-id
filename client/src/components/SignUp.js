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

class SignUp extends Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmation: '',
            errors: {},
            showConfirmation: false,
            actionSuccess: false,
            statusMessage: ''
        };
        
        this.submitHandler = this.submitHandler.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.passwordConfirmationChange = this.passwordConfirmationChange.bind(this);
        this.clearFields = this.clearFields.bind(this);
    }

    clearFields(){
        let fields = document.querySelectorAll('.form__field');
        for(let i of fields){
            i.value = '';
        }
    }
    
    usernameChange(evt){
        this.setState({username: evt.target.value});
    }

    passwordChange(evt){
        this.setState({password: evt.target.value});
    }

    passwordConfirmationChange(evt){
        this.setState({confirmation: evt.target.value});
    }


    submitHandler(evt){
        evt.preventDefault();
        this.clearFields();
        
        const data = {
            username: this.state.username,
            password: this.state.password,
            confirmPassword: this.state.confirmation
        };

        console.log(data)

        const serverResponse = sendUserData('/auth/signup', data);

        serverResponse.then( repsonse => repsonse.json())
        .then((signUpStatus) => {


            // If validation errors were found
            if(signUpStatus.validationErrors){

                this.setState({
                    errors: signUpStatus.validationErrors,
                    showConfirmation: true,
                    statusMessage: 'There were incorrect and/or missing fields.'
                });
            }
            else if(signUpStatus.error) return Promise.reject(new Error(signUpStatus.error))
            else{
                this.props.dispatch(addAuth(signUpStatus.user));
            }

        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err);
        });
    }
   
    render(){

        const { errors } = this.state;
        // Redirect once user successfully signs up
        if(this.props.isAuth){
            return <Redirect to='/'/>
        }

        return(
            
            <div className='img-spread2' >
            <div className='form-content-container'>
                    <div className='form-container'>

                    
                    <form className='form' autoComplete='off' onSubmit={this.submitHandler}>
                        <h1>Sign Up</h1>

                        {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                        }

                        <InputField label='Username:' type='text' name='username' required={true} onChange={this.usernameChange}/>
                            {errors.username && 
                                <div className='form__text--error'>{this.state.errors.username.msg}</div>
                            }

                        <InputField label='Password:' type='password' name='password' required={true} onChange={this.passwordChange}/>
                            {errors.password && 
                                <div className='form__text--error'>{this.state.errors.password.msg}</div>
                            }

                        <InputField label='Re-enter Password:' type='password' name='confirm-password' required={true} onChange={this.passwordConfirmationChange}/>
                            {errors.confirmPassword && 
                                <div className='form__text--error'>{this.state.errors.confirmPassword.msg}</div>
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

export default connect(mapStateToProps)(SignUp);