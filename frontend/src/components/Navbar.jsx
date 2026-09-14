import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
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
                <li>
                    <Link to='/'>Profile</Link>
                </li>
            </ul>
        </div>
    )
}
