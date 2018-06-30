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

        const data = {
            password: this.state.password,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        };

        const passwordFields = document.querySelectorAll('.passwordInput');
        const serverResponse = sendUserData('/profile/settings/change-password', data);

        for(let input of passwordFields){
            input.value = '';
        }

        

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
                console.log(`changed the password, no issues`)
            }
            else{
                this.setState({
                    errors: data.errors
                });
            }

            console.log(data.errors);
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
                            <input type='password' name='password' required onChange={this.passwordChange} className='passwordInput'/>
                        </label>
                        <label>
                            New Password:
                            <input type='password' name='newpassword' required onChange={this.newPasswordChange} className='passwordInput'/>
                        </label>
                        

                        {errors.newPassword && 
                        <span>{errors.newPassword.msg}</span>}
                        <label>
                            Re-enter New Password:
                            <input type='password' name='confirmpassword' required onChange={this.confirmPasswordChange} className='passwordInput'/>
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