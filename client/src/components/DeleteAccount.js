import React, { Component } from 'react';
import PageHead from './PageHead';
import { sendUserData } from '../util/serverFetch';


class DeleteAccount extends Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmation: '',
            errors: {},
            errorStatus: false,
        };
        
        this.submitHandler = this.submitHandler.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.passwordConfirmationChange = this.passwordConfirmationChange.bind(this);
        this.clearFields = this.clearFields.bind(this);
    }

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

        const serverResponse = sendUserData('/profile/settings/delete-account', data);
        serverResponse.then((res) => {
            console.log(res)
            if(res.status === 422){
                this.setState({
                    errorStatus: true
                });
            }
            return res.json();
        })
        .then((status) => {
            console.log(status);
            if(this.state.errorStatus){
                let errorMessages = Object.assign({}, status.errors);

                this.setState({
                    errors: errorMessages 
                });
            }

            else{
                // Pop up modal for user to confirm action

                console.log('touching');
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
                <PageHead pageHead='Delete Account' />
                <div>
                    <form action="" onSubmit={this.submitHandler}>
                        <label>
                            Username:
                            <input type="text" className="userfield" name="username" onChange={this.usernameChange}/>
                                    {errors.username && 
                                <span>{errors.username.msg}</span>}
                        </label>
                        <label>
                            Password:
                            <input type="text" className="userfield" name="password" onChange={this.passwordChange}/>
                        </label>
                        <label>
                            Re-enter Password:
                            <input type="text" className="userfield" name="confirm-password" onChange={this.passwordConfirmationChange}/>
                                    {errors.confirmPassword && 
                                <span>{errors.confirmPassword.msg}</span>}
                        </label>
                        <button>Delete</button>
                    </form>
                </div>
            </section>

        )
    }
}

export default DeleteAccount;