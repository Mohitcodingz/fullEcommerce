import { useContext } from 'react';
import { Link, UNSAFE_SingleFetchRedirectSymbol, useNavigate } from 'react-router-dom'
import '../styles/navbar.css'
import AuthContext from '../context/AuthContext';

export default function Navbar() {
    // reviving the values foromthe authprovider.
    const { user, logout } = useContext(AuthContext);
    const cartItems = useSelector((state)=>{state.cart.cartItems});
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login')
    }

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
                    <Link to='/cart'>{cartItems.length}</Link>
                </li>
                {
                    user ? (<div>
                        <li><Link to='/profile'>Hi, {user.name}</Link>
                        </li>{user.role === 'admin' ? <li><Link to='/admin'>Admin</Link></li> : null}
                        <li><button onClick={handleLogout}>LogOut</button></li>
                    </div>) : (
                        <li><Link to='/login'>
                            Login</Link></li>
                    )
                }

            </ul >
        </div >
    )
}
