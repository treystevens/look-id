import React from 'react';
import authHOC from '../hoc/auth-hoc';
import Button from './Button';
import ConfirmAction from './ConfirmAction';
import InputField from './InputField';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Auth.css';


const Login = (props) => {


        return(
            <div className='img-spread2  content' >
                <div className='form-content-container'>
                    <div className='form-container'>
                            <form className='form' autoComplete='off' onSubmit={props.submitHandler}>
                                <h1>Login</h1>

                            {props.showConfirmation &&
                                <ConfirmAction actionSuccess={props.actionSuccess} statusMessage={props.statusMessage}/>
                            }

                                <InputField label='Username:' type='text' name='username' required={true} onChange={props.usernameChange}/>

                                <InputField label='Password:' type='password' name='password' required={true} onChange={props.passwordChange}/>
                                
                                <div className='form__actions'>
                                    <Button text='Login' />
                                    <Link to='/signup' className='form__action'>Don't have an account?</Link>
                                </div>
                        </form>
                    </div>
                    
                </div>
            </div>
        )
}


function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username
    };
}

// const mapDispatchToProps = dispatch => {
//     return {
//       authorizeUser: user => {
//         dispatch(addAuth(user.user))
//       }
//     }
// }

export default connect(mapStateToProps)(authHOC(Login))