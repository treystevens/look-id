import React, { Component } from 'react';
import PageHead from './PageHead';
import { sendUserData } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';
import InputField from './InputField';
import Button from './Button';

class ChangePassword extends Component{
    constructor(props){
        super(props);

        this.state = {
            password: '',
            newPassword: '',
            confirmPassword: '',
            errors: {},
            errorStatus: false,
            actionSuccess: false,
            statusMessage: '',
            showConfirmation: false
        };

        this.submitNewPassword = this.submitNewPassword.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.newPasswordChange = this.newPasswordChange.bind(this);
        this.passwordConfirmationChange = this.passwordConfirmationChange.bind(this);
        this.clearFields = this.clearFields.bind(this);
    }

    // Clear input fields on submit
    clearFields(){
        let fields = document.querySelectorAll('.form__field');
        for(let input of fields){
            input.value = '';
        }
    }

    passwordChange(evt){
        this.setState({password: evt.target.value});
    }

    newPasswordChange(evt){
        this.setState({newPassword: evt.target.value});
    }

    passwordConfirmationChange(evt){
        this.setState({confirmPassword: evt.target.value});
    }

    submitNewPassword(evt){

        evt.preventDefault();
        this.clearFields();

        // Reset error state
        this.setState({
            errorStatus: false,
            errors: {}
        });

        const data = {
            password: this.state.password,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        };

        const serverResponse = sendUserData('/profile/settings/change-password', data);

        serverResponse.then( response => response.json())
        .then((data) => {
            
            // If validation errors were found
            if(data.validationErrors){

                this.setState({
                    errors: data.validationErrors,
                    showConfirmation: true,
                    statusMessage: 'There were incorrect and/or missing fields.'
                });
            }

            // Error if problem hashing
            else if(data.error) return Promise.reject(new Error(data.error));

            else{

                this.setState({
                    showConfirmation: true,
                    actionSuccess: true,
                    statusMessage: 'Your password has been changed!'
                });
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

        const errors = this.state.errors;

        return(
            <section className='container'>
                <PageHead pageHead='Change Password' />
                {this.state.showConfirmation &&
                    <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                }
                
                    <form onSubmit={this.submitNewPassword} className='form__profile' autoComplete='off'>
                        
                        <InputField label='Current Password:' type='password' name='password' required={true} onChange={this.passwordChange} size='med'/>
                        {errors.password && 
                        <span className='form__text--error'>{errors.password.msg}</span>}

                        <InputField label='New Password:' type='password' name='new-password' required={true} onChange={this.newPasswordChange} size='med'/>
                        

                        {errors.newPassword && 
                        <span className='form__text--error'>{errors.newPassword.msg}</span>}

                        <InputField label='Re-enter New Password:' type='password' name='confirm-password' required={true} onChange={this.passwordConfirmationChange} size='med'/>

                        {errors.confirmPassword && 
                        <span className='form__text--error'>{errors.confirmPassword.msg}</span>}
                        <Button text='Change Password' addClass='btn--update  btn--small' />
                    </form>
                
            </section>
        )
    }
}

export default ChangePassword