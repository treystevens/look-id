import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addAuth } from '../actions/actions';
import { Redirect } from 'react-router';
import { sendUserData } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';
import InputField from './InputField';
import Button from './Button';
import './Auth.css';


class Login extends Component{

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            errorStatus: false,
            showConfirmation: false,
            actionSuccess: false,
            statusMessage: ''
        };
        
        this.submitHandler = this.submitHandler.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.clearFields = this.clearFields.bind(this);
    }

    // Clear input fields
    clearFields(){
        let fields = document.querySelectorAll('.form__field');
        for(let input of fields){
            input.value = '';
        }
    }
    
    usernameChange(evt){
        this.setState({username: evt.target.value});
    }

    passwordChange(evt){
        this.setState({password: evt.target.value});
    }

    // Login submit
    submitHandler(evt){
        evt.preventDefault();
        this.clearFields();
        
        
        const data = {
            username: this.state.username,
            password: this.state.password,
        };

        const serverResponse = sendUserData('/auth/login', data);
        serverResponse.then((response) => {

            // Incorrect information or user might not exist
            if(response.status === 401){
                return Promise.reject(new Error('Username or password is incorrect'));
            }
            return response.json();
        })
        .then((authorizedUser) => {
            // Authorize user
            this.props.dispatch(addAuth(authorizedUser.user));
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

        // Once authorized redirect to homepage
        if(this.props.isAuth){
            return <Redirect to='/'/>
        }

        return(
            <div className='img-spread1' >
                <div className='form-content-container'>
                    <div className='form-container'>
                            <form className='form' autoComplete='off' onSubmit={this.submitHandler}>
                                <h1>Login</h1>

                            {this.state.showConfirmation &&
                                <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                            }

                                <InputField label='Username:' type='text' name='username' required={true} onChange={this.usernameChange}/>

                                <InputField label='Password:' type='password' name='password' required={true} onChange={this.passwordChange}/>
                                
                                <div className='form__actions'>
                                    <Button text='Login' />
                                    <Link to='/signup' className='form__action'>Don't have an account?</Link>
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
      username: state.username
    };
}

export default connect(mapStateToProps)(Login)