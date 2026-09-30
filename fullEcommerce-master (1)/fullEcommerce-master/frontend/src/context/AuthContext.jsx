import { useState, useEffect } from 'react'
import AuthContext from './authContextValue'

export function AuthProvider({ children }) {
    // Restore session on reload (was missing: user logged out on every refresh)
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("userInfo");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    useEffect(() => {
        try {
            const saved = localStorage.getItem("userInfo");
            if (saved) setUser(JSON.parse(saved));
        } catch {
            localStorage.removeItem("userInfo");
        }
    }, []);
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
