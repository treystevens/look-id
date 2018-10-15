import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { sendUserData } from '../util/serverFetch';
import { addAuth } from '../actions/actions';
import '../components/Auth.css';


const authHOC = (WrappedComponent) => {
    return class extends Component{
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
    
            const serverResponse = sendUserData(`/auth/${this.props.param}`, data);
    
            serverResponse.then((response) => {

                // Incorrect information or user might not exist
                if(response.status === 401){
                    return Promise.reject(new Error('Username or password is incorrect'));
                }
                return response.json();
            })
            .then((data) => {
    
    
                // If validation errors were found
                if(data.validationErrors){
    
                    this.setState({
                        errors: data.validationErrors,
                        showConfirmation: true,
                        statusMessage: 'There were incorrect and/or missing fields.'
                    });
                }
                else if(data.error) return Promise.reject(new Error(data.error));
                else{
                    this.props.dispatch(addAuth(data.user));
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
            
            const { isAuth } = this.props;
            // Redirect once user successfully signs up
            if(isAuth){
                return <Redirect to='/'/>
            }
    
            return(
                <WrappedComponent 
                    {...this.props} 
                    usernameChange={this.usernameChange} 
                    passwordChange={this.passwordChange} 
                    passwordConfirmationChange={this.passwordConfirmationChange}
                    submitHandler={this.submitHandler} 
                    {...this.state}/>
            )
        }
    }
}


export default authHOC;