import React, { Component } from 'react';
import '../styles/styles.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addAuth } from '../actions/actions';
import { Redirect } from 'react-router';
import { sendUserData } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';


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
        let fields = document.querySelectorAll('.userfield');
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
            <div className='container  img-spread1' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div className='flex-container' style={{width: '60%', height: '70vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <form className='test-form' autoComplete='off' onSubmit={this.submitHandler} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>

                    {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.confirmAction} statusMessage={this.state.statusMessage}/>
                    }
                        <label>Username:
                            <input type='text' placeholder='Username' name='username' onChange={this.usernameChange}required  className='userfield'/>
                        </label>

                    
                        <label>Password:
                            <input type='password' placeholder='Password' name='password' onChange={this.passwordChange} required className='userfield'/>
                        </label>
                        
                        <button>Login</button>
                    </form>
                    <Link to='/signup'>Don't have an account?</Link>
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