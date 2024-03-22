/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        username: null,
        password: null
    })

    const [authenticated, setAuthenticated] = useState(false)

    const visitorData = useVisitorData({
        extendedResult: true
    }, {
        immediate: true
    })

    const signIn = (userData) => {
        setUserData(() => userData)
        setAuthenticated(() => true)
    }

    const signOut = () => {
        setUserData(() => ({
            username: null,
            password: null
        }))
        setAuthenticated(() => false)
    }

    return (
        <AuthContext.Provider value={{ userData, setUserData, authenticated, signIn, signOut, visitorData }}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;