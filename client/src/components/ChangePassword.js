import React, { Component } from 'react';
import PageHead from './PageHead';
import { sendUserData } from '../util/serverFetch';


class ChangePassword extends Component{
    constructor(props){
        super(props);

        this.state = {
            password: '',
            newPassword: '',
            confirmPassword: '',
            errors: {},
            errorStatus: false
        };

        this.submitNewPassword = this.submitNewPassword.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.newPasswordChange = this.newPasswordChange.bind(this);
        this.confirmPasswordChange = this.confirmPasswordChange.bind(this);
        this.clearFields = this.clearFields.bind(this);
    }

    clearFields(){
        let fields = document.querySelectorAll('.userfield');
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

    confirmPasswordChange(evt){
        this.setState({confirmPassword: evt.target.value});
    }



    submitNewPassword(evt){

        evt.preventDefault();
        this.clearFields();

        // Reset error state
        this.setState({
            errorStatus: false
        });

        const data = {
            password: this.state.password,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        };

        const serverResponse = sendUserData('/profile/settings/change-password', data);

        serverResponse.then((res) => {
            if(res.status === 422){
                this.setState({
                    errorStatus: true
                });
            }
            return res.json();
        })
        .then((data) => {
            
            if(data.success){
                console.log(`changed the password, no issues`);
            }
            else{
                this.setState({
                    errors: data.errors
                });
            }

            
        })
        .catch((err) => {
            console.log(err);
        });

    }

    render(){

        let errors = this.state.errors;


        return(
            <section>
                <PageHead pageHead='Change Password' />
                <div>
                    <form action="" onSubmit={this.submitNewPassword}>
                        <label>
                            Current Password:
                            <input type='password' name='password' required onChange={this.passwordChange} className='password-input'/>
                        </label>
                        {errors.password && 
                        <span>{errors.password.msg}</span>}

                        <label>
                            New Password:
                            <input type='password' name='new-password' required onChange={this.newPasswordChange} className='password-input'/>
                        </label>
                        

                        {errors.newPassword && 
                        <span>{errors.newPassword.msg}</span>}
                        <label>
                            Re-enter New Password:
                            <input type='password' name='confirm-password' required onChange={this.confirmPasswordChange} className='password-input'/>
                        </label>

                        {errors.confirmPassword && 
                        <span>{errors.confirmPassword.msg}</span>}
                        <button>Change</button>
                    </form>
                </div>
            </section>
        )
    }
}

export default ChangePassword