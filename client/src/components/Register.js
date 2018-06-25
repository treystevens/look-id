import React, { Component } from 'react';
import '../styles/styles.css';

class Register extends Component{
    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            confirmation: '',
            errors: {},
            errorStatus: false
        }
        
        this.submitHandler = this.submitHandler.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.passwordConfirmationChange = this.passwordConfirmationChange.bind(this);
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
        
        const data = {
            username: this.state.username,
            password: this.state.password,
            passwordconfirmation: this.state.confirmation
        };

        fetch('/auth/signup', {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            console.log(response)
            console.log(this.state.errorStatus)
            

            if(response.status === 422){
                this.setState({
                    errorStatus: true
                });
            }
            else{
                this.setState({
                    errorStatus: false
                });
            }

            return response.json()
        })
        .then((registerStatus) => {

            if(this.state.errorStatus){
                let errorMessages = Object.assign({}, registerStatus.errors)

                console.log(errorMessages)

                this.setState({
                    errors: errorMessages 
                }, () => {
                    // console.log(this.state, `this is the state object`)
                    // console.log(errorMessages, `this is the errorMessages that we`)
                    console.log(this.state.errors)
                });
            }

            else{


                console.log(`we just added a new account`)
                console.log(registerStatus)
            }

        })
        .catch((err) => {
            console.log(err)
        })
    }

    // const ProtectedComponent = () => {
    //     if (authFails)
    //        return <Redirect to='/login'  />
    //    }
    //    return <div> My Protected Component </div>
    //    }
   

    render(){
        return(
        <div className="container  img-spread2" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <form className="test-form" autoComplete="off" onSubmit={this.submitHandler} style={{width: '60%', height: '70vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        
                <label>Username:
                    <input type="text" placeholder="Account Name" name="username" onChange={this.usernameChange}required/>
                </label>

                {this.state.errors.username && 
                <span className="form-error">{this.state.errors.username.msg}</span>
                }

                <label>Password:
                    <input type="password" placeholder="Account Password" name="password" onChange={this.passwordChange} required />
                </label>

                {this.state.errors.password && 
                    <span className="form-error">{this.state.errors.password.msg}</span>
                }

                <label>Re-Enter Password:
                    <input type="password" placeholder="Re-Enter Password" name="passwordconfirmation" onChange={this.passwordConfirmationChange} required />
                </label>

                {this.state.errors.passwordconfirmation && 
                    <span className="form-error">{this.state.errors.passwordconfirmation.msg}</span>
                } 
                    
                <button>Create Account</button>
            </form>
    
        </div>
        )
    }
}

export default Register;