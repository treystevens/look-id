import React, { Component } from 'react';
import AccountHead from './AccountHead';
import { NavLink, Link } from 'react-router-dom';



/* jshint ignore:start */


class Header extends Component{
    constructor(props){
        super(props)

        
    }
    // Have a state of wether desktop and mobile to pass to Hamburger menu and sign in/ sign up


    render(){
        return(
            <header>
                <div>
                        <Link to='/'><h1>LookID.</h1></Link>
                    <nav>
                        <ul>
                            <li><NavLink to='/'>Home</NavLink></li>
                            <li><NavLink to='/explore'>Explore</NavLink></li>
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