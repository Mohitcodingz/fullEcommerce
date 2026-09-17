import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/navbar.css'
import AuthContext from '../context/store'

export default function Navbar() {
// reviving the values foromthe authprovider.
    const { user, login, logOut } = useContext(AuthContext);
    // const cartItems = useSelector((state)=>)
    return (
        <div className='navbar'>
            <div className="navbarBrand">
                <Link to='/logo'>
                    <img src="/myBagsLightTheme.png" className='navbarLogo' />
                </Link>
            </div>
            <ul className="navbarLinks">
                <li>
                    <Link to='/'>Home Page</Link>
                </li>
                <li>
                    <Link to='/shop'>Shop</Link>
                </li>

                <li>
                    <Link to='/cart'>Cart</Link>
                </li>
               {
                user?(
                    <>
                    <li><Link to='' >Hi, {user.name}</Link></li>
                    {user.role

                    }
                    </>
                ):()
               }
                <li>
                    <Link to='/cart'>Cart</Link>
                </li>
                <li>
                    <Link to='/profile'>Profile</Link>
                </li>
            </ul>
        </div>
    )
}
