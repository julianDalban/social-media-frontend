import React, { createContext, useState, useEffect, useContext, use } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};