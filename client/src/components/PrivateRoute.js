import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';


function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
    };
}

const PrivateRoute = ({component: Component, ...rest}) => {
    console.log(rest)
    return(
    <Route {...rest} render={(props) => (
        rest.isAuth ? 
            <Component {...props} /> 
            :
            <Redirect to='/signup'/>
        )} />
    )
}




export default connect(mapStateToProps)(PrivateRoute)