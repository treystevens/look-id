import React, { Component } from 'react';
import PageHead from './PageHead';
import { sendUserData } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';
import { connect } from 'react-redux';
import InputField from './InputField';
import Button from './Button';



class DeleteAccount extends Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmation: '',
            errors: {},
            actionSuccess: false,
            statusMessage: '',
            showConfirmation: false
        };
        
        this.submitHandler = this.submitHandler.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
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

    // Field onChange handling functions ~
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
        serverResponse.then(response => response.json())
        .then((data) => {

            // Validation errors from fields
            if(data.validationErrors){
                this.setState({
                    errors: data.validationErrors,
                    showConfirmation: true,
                    statusMessage: 'There were incorrect and/or missing fields.'
                });
            }

            // Error with user in database
            else if(data.error) return Promise.reject(new Error(data.error));

            // Account successfully deleted and redirected to homepage
            else{
                this.props.dispatch({type: 'LOGOUT'});
            }
        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err
            });
            console.log(err);
        });
    }

    render(){

        const { errors } = this.state;
        console.log(this.state)
        return(
            <section className='container'>
                <PageHead pageHead='Delete Account' />
                {this.state.showConfirmation &&
                    <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                }
                <div>
                    <form onSubmit={this.submitHandler} className='form__profile' autoComplete='off'>
                        


                        <InputField label='Username:' type='text' name='username' required={true} onChange={this.usernameChange} size='med'/>
                        {errors.username && 
                                <span className='form__text--error'>{errors.username.msg}</span>}


                        <InputField label='Password:' type='password' name='password' required={true} onChange={this.passwordChange} size='med'/>


                        <InputField label='Re-enter New Password:' type='password' name='confirm-password' required={true} onChange={this.passwordConfirmationChange} size='med'/>

                        {errors.confirmPassword && 
                                <span className='form__text--error'>{errors.confirmPassword.msg}</span>}

                       
                       <Button text='Delete Account' addClass='btn--caution  btn--small' size='small'/>
                    </form>
                </div>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
    };
}

export default connect(mapStateToProps)(DeleteAccount);