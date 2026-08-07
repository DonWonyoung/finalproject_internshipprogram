import { createContext, useContext, useState } from "react"
import { CartContext } from "./Cart"

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const userInfo = localStorage.getItem('userInfo')
    const [user, setUser] = useState(userInfo ? JSON.parse(userInfo) : null)
    const { clearCart } = useContext(CartContext)

    const login = (user) => {
        setUser(user)
        localStorage.setItem("userInfo", JSON.stringify(user))
    }

    const logout = () => {
        localStorage.removeItem('userInfo')
        setUser(null)
    }

    return <AuthContext.Provider value = {{
        user, login, logout
    }}>
        {children}
    </AuthContext.Provider>
}