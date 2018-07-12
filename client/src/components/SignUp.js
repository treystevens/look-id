import React, { Component } from 'react';
import '../styles/styles.css';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { addAuth, updateAvatar } from '../actions/actions';
import { sendUserData } from '../util/serverFetch';

class SignUp extends Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmation: '',
            errors: {},
            errorStatus: false,
        }
        
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

        // Reset error state
        this.setState({
            errorStatus: false
        });
        
        const data = {
            username: this.state.username,
            password: this.state.password,
            confirmPassword: this.state.confirmation
        };

        const serverResponse = sendUserData('/auth/signup', data);
        serverResponse.then((res) => {
            
            if(res.status === 422){
                this.setState({
                    errorStatus: true
                });
            }
            return res.json();
        })
        .then((signUpStatus) => {

        
            if(this.state.errorStatus){
                let errorMessages = Object.assign({}, signUpStatus.errors);

                this.setState({
                    errors: errorMessages 
                });
            }

            else{
                this.props.dispatch(addAuth(signUpStatus.user));
                this.props.dispatch(updateAvatar(signUpStatus.user.avatar));
            }

        })
        .catch((err) => {
            console.log(err);
        });
    }
   
    render(){


        if(this.props.isAuth){
            return <Redirect to='/'/>
        }


        return(
            
            <div className="container  img-spread2" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div className="flex-container" style={{width: '60%', height: '70vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <form className="test-form" autoComplete="off" onSubmit={this.submitHandler} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            
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
      userID: state.userID,
      myAvatar: state.avatar
    };
}

export default connect(mapStateToProps)(SignUp);