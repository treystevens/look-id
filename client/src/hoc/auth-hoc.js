import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { addAuth } from '../actions/actions';
import { sendUserData } from '../util/serverFetch';
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
    
            const serverResponse = sendUserData(`/auth/${this.props.params}`, data);
    
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
                else if(signUpStatus.error) return Promise.reject(new Error(signUpStatus.error));
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
            const { isAuth, params } = this.props;
            // Redirect once user successfully signs up
            if(isAuth){
                return <Redirect to='/'/>
            }

            // const showCmpt = params ?
            // () :

            // (<WrappedComponent 
            //     {...this.props} 
            //     usernameChange={this.usernameChange} 
            //     passwordChange={this.passwordChange}
            //     submitHandler={this.submitHandler}  />)

                console.log(params)
    
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

// function mapStateToProps(state) {
//     return {
//       isAuth: state.isAuth,
//       username: state.username,
//     };
// }

export default authHOC;