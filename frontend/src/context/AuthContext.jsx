import React, { use, useState } from "react";
import { createContext, useContext } from "react";

export default function AuthContext() {
    const [user, setUser] = useState(null);
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    }
    const logout =()=>{
        setUser(null);
        localStorage.removeItem('userInfo')
    }
    return (
        <div>
<AuthContext.Provider value={{user,login,logout}}>
{childern}
</AuthContext.Provider>
        </div>
    )
}
