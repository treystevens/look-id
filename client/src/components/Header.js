import React, { Component } from 'react';
import AccountNav from './AccountNav';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';


class Header extends Component{

    render(){
        return(
            <header className='container  header-container--flex'>
                <div className='header-site-nav'>
                    <Link to='/'><h1 className='logo'>LookID.</h1></Link>
                    <nav className='global-nav'>
                        <ul className='site-nav-list'>
                            <li className='site-nav-list__item'><NavLink to='/'>Home</NavLink></li>
                            <li className='site-nav-list__item'><NavLink to='/feed'>Feed</NavLink></li>
                            <li className='site-nav-list__item'><NavLink to='/boards'>Boards</NavLink></li>
                        </ul>
                    </nav>
                </div>
                <AccountNav/>
            </header>
        )
    }
}

export default Header;