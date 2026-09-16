import { createContext, useState } from 'react';
import AuthContext from './store'
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo')
    }
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider
