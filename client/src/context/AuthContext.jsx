import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser_v1')));

    const login = (userInfo) => {
        localStorage.setItem('currentUser_v1', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const logout = () => {
        localStorage.removeItem('currentUser_v1');
        setUser(null);
    };

    const refreshUser = () => {
        const updated = JSON.parse(localStorage.getItem('currentUser_v1'));
        setUser(updated);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
