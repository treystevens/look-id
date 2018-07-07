import React, { Component } from 'react';
import '../styles/styles.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addAuth } from '../actions/addAuth';
import { Redirect } from 'react-router';
import { sendUserData } from '../util/serverFetch';



class Login extends Component{

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            errorStatus: false
        };
        
        this.submitHandler = this.submitHandler.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
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

    submitHandler(evt){
        evt.preventDefault();
        this.clearFields();
        
        
        const data = {
            username: this.state.username,
            password: this.state.password,
        };

        const serverResponse = sendUserData('/auth/login', data);
        serverResponse.then((res) => {
            // console.log(res);

            if(res.status === 401){
                this.setState({
                    errorStatus: true
                });
                return 1;
            }

            return res.json();
        })
        .then((logged) => {

            console.log(logged, ` this is the logged from login`)
            
            if(logged.actionSuccess){
                console.log(logged.user);
                this.props.dispatch(addAuth(logged.user));
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
            <div className="container  img-spread1" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div className="flex-container" style={{width: '60%', height: '70vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <form className="test-form" autoComplete="off" onSubmit={this.submitHandler} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>

                    {this.state.errorStatus &&
                    <span>Username or password is incorrect</span>}
                        <label>Username:
                            <input type="text" placeholder="Username" name="username" onChange={this.usernameChange}required  className="userfield"/>
                        </label>

                    
                        <label>Password:
                            <input type="password" placeholder="Password" name="password" onChange={this.passwordChange} required className="userfield"/>
                        </label>
                        
                        <button>Login</button>
                    </form>
                    <Link to='/signup'>Don't have an account?</Link>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username,
      userID: state.userID
    };
}


// export default Login;
export default connect(mapStateToProps)(Login)