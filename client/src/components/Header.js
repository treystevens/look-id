import React, { Component } from 'react';
import AccountHead from './AccountHead';
import { NavLink } from 'react-router-dom';
// import '../../public/sheets/styles.css';

/* jshint ignore:start */


class Header extends Component{
    constructor(props){
        super(props)

        
    }
    // Have a state of wether desktop and mobile to pass to Hamburger menu and sign in/ sign up

    componentDidMount(){
        'we mounted'

        // fetch('/auth',{
        //     method: 'GET'
        // })
        // .then((res) => {
        //     console.log(res)
        //     return res.json()
        // })
        // .then((user) => {
        //     console.log(user)
        // })
        // .catch((err) => {
        //     console.log(err)
        // })
    }

    render(){
        return(
            <header>
                <div>
                        <h1>LookID.</h1>
                    <nav>
                        <ul>
                            {/* <li><a href="explore">Explore</a></li>
                            <li><a href="feed">Feed</a></li>
                            <li><a href="boards">Boards</a></li> */}
                            <li><NavLink to='/'>Explore</NavLink></li>
                            <li><NavLink to='/feed'>Feed</NavLink></li>
                            <li><NavLink to='/boards'>Boards</NavLink></li>
                        </ul>
                    </nav>
                </div>
                <AccountHead/>
            </header>
        )
    }
}

export default Header;

// Code here will be ignored by JSHint.
/* jshint ignore:end */