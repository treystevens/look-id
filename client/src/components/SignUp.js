import React, { Component } from 'react';
import '../styles/styles.css';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { addAuth } from '../actions/actions';
import { sendUserData } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';

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
        let fields = document.querySelectorAll('.userfield');
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

        // Redirect once user successfully signs up
        if(this.props.isAuth){
            return <Redirect to='/'/>
        }


        return(
            
            <div className="container  img-spread2" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div className="flex-container" style={{width: '60%', height: '70vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>


                    
                    <form className="test-form" autoComplete="off" onSubmit={this.submitHandler} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>

                    {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.confirmAction} statusMessage={this.state.statusMessage}/>
                    }
            
                    <label>Username:
                        <input type="text" placeholder="Account Name" name="username" onChange={this.usernameChange}required className="userfield"/>
                    </label>

                    {this.state.errors.username && 
                    <span className="form-error">{this.state.errors.username.msg}</span>
                    }

                    <label>Password:
                        <input type="password" placeholder="Account Password" name="password" onChange={this.passwordChange} required className="userfield"/>
                    </label>

                    {this.state.errors.password && 
                        <span className="form-error">{this.state.errors.password.msg}</span>
                    }

                    <label>Re-Enter Password:
                        <input type="password" placeholder="Re-Enter Password" name="confirm-password" onChange={this.passwordConfirmationChange} required className="userfield"/>
                    </label>

                    {this.state.errors.confirmPassword && 
                        <span className="form-error">{this.state.errors.confirmPassword.msg}</span>
                    } 
                        
                    <button>Create Account</button>
                </form>
                <Link to='/login'>Already have an account?</Link>
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