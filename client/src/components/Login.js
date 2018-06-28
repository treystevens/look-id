import React, { Component } from 'react';
import '../styles/styles.css';
import { connect } from 'react-redux';

class Login extends Component{

    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            errors: {},
            errorStatus: false
        }
        
        this.submitHandler = this.submitHandler.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);

    }

    componentDidMount(){
        fetch('/auth/login',{
            method: 'GET',
            credentials: 'include'
        })
        .then((res) => {
            console.log(res)
            return res.json()
        })
        .then((user) => {
            console.log(user, `app fetch to /login`)
        })
        .catch((err) => {
            console.log(err)
        })
        }
    
    usernameChange(evt){
        this.setState({username: evt.target.value});
    }

    passwordChange(evt){
        this.setState({password: evt.target.value});
    }

    submitHandler(evt){
        evt.preventDefault();
        
        const data = {
            username: this.state.username,
            password: this.state.password,
        };

        fetch('/auth/login', {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
        .then((res) => {
            // console.log(res);
            return res.json();
        })
        .then((logged) => {
            
            if(logged.success){
                console.log(logged.user)
               

                this.props.dispatch({
                    type: 'AUTHENTICATE', 
                    user: logged.user.username,
                    userID: logged.user.userID
                });
                
            }

        })
        .catch((err) => {
            console.log(err);
        });
    }

    render(){
        return(
            <div className="container  img-spread1" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div className="flex-container" style={{width: '60%', height: '70vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <form className="test-form" autoComplete="off" onSubmit={this.submitHandler} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    
                        <label>Username:
                            <input type="text" placeholder="Username" name="username" onChange={this.usernameChange}required/>
                        </label>

                    
                        <label>Password:
                            <input type="password" placeholder="Password" name="password" onChange={this.passwordChange} required />
                        </label>
                        
                        <button>Login</button>
                    </form>
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