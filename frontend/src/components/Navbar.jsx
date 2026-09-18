import { useContext } from 'react';
import { Link } from 'react-router-dom'
import '../styles/navbar.css'
import AuthContext from '../context/AuthContext';

export default function Navbar() {
    // reviving the values foromthe authprovider.
    const { user, logout } = useContext(AuthContext);

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
                    <Link to='/cart'>Cart </Link>
                </li>

                {

                    user ? (<div>
                        <li><Link to='/profile'>Hi, {user.name}</Link>
                        </li>{user.role === 'admin' && <li><Link to='/admin'>Admin</Link></li>}
                        <li><button onClick={logout}>LogOut</button></li>
                    </div>) : (
                        <li><Link to='/login'>
                            Login</Link></li>
                    )

                }

            </ul >
        </div >
    )
}
