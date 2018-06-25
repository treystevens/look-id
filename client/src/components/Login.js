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
            }
        })
        .then((res) => {
            // console.log(res);
            return res.json();
        })
        .then((logged) => {
            

            // console.log(logged)
            if(logged.success){
                // this.props.dispatch(authAndUsername(logged.user))
                // this.props.dispatch(includeUsername(logged.user), addAuth());
                // this.props.dispatch([addAuth(), includeUsername(logged.user)]);
                console.log(logged.user)
                // this.props.dispatch(includeUser(logged.user));

                this.props.dispatch({
                    type: 'AUTHENTICATE', 
                    user: logged.user.username,
                    userID: logged.user.userID
                });
                
                

                // dispatch({
                //     type: 'USERNAME',
                //     text: logged.user
                // })
                // this.props.checkAuth(action.success);
            }

            // console.log(action);
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

// function mapStateToProps(state) {
//     return {
//       isAuth: state.isAuth,
//       user: state.user
//     };
// }

function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username,
      userID: state.userID
    };
}

// function authAndUsername(username) {
 
//    console.log(username)
//     return function (dispatch) {
//       return addAuth().then(
//         user => dispatch(includeUsername(username))
//       );
//     };
// }

// function addAuth() {
//     let obj = { type: 'AUTHORIZE' }
//     Promise.resolve(obj)
//     return obj
// }

// function addAuth() {
//     return new Promise((resolve, reject) => {
//         dispatch({
//             type: 'AUTHORIZE'
//         })
//     })
// }


// function includeUser(user) {
//     return { 
//         type: 'USERNAME', 
//         user: user.username,
//         userId: user.userId
//     }
// }









// function getWantedList() {  
// return dispatch => {
//     axios.get('../wanted_list.json')
//     .then(res => {
//         const people = res.data.map(person => {
//         person.note = 'none';
//         return person;
//         });
//         dispatch(getUsersAsync(people));
//     });
// }


// export default Login;
export default connect(mapStateToProps)(Login)