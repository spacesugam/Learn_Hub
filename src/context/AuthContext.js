// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api'; // Import your API service

const AuthContext = createContext(null);

const getStoredCurrentUser = () => {
    const user = localStorage.getItem('learnhubCurrentUser');
    return user ? JSON.parse(user) : null;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(getStoredCurrentUser);
    const [loading, setLoading] = useState(true); // Set to true initially
    const navigate = useNavigate();

    useEffect(() => {
        // This effect runs once on mount to check initial auth state
        // For this mock setup, currentUser is already loaded from localStorage sync
        // In a real app with tokens, you might validate token here
        setLoading(false);
    }, []);


    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('learnhubCurrentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('learnhubCurrentUser');
        }
    }, [currentUser]);

    const login = async (username, password) => {
        setLoading(true);
        // In a real app, this would be an API call.
        // For the mock, we fetch users from our api.js which reads db.json
        const users = await api.getUsers(); // Fetches from DB_CACHE
        const user = users.find(
            (u) => u.username === username && u.password === password // INSECURE!
        );

        if (user) {
            if (user.status === 'inactive') {
                 setLoading(false);
                return { success: false, message: 'Your account is inactive. Please contact support.' };
            }
            setCurrentUser(user);
            setLoading(false);
            return { success: true, user };
        } else {
            setCurrentUser(null);
            setLoading(false);
            return { success: false, message: 'Invalid username or password' };
        }
    };

    const register = async (username, password, email, role) => {
        setLoading(true);
        const existingUser = await api.findUserByUsername(username);
        if (existingUser) {
            setLoading(false);
            return { success: false, message: 'Username already exists' };
        }

        // In real app, hash password on backend
        const newUserPayload = {
            username,
            password, // Store plain text - BAD PRACTICE!
            email,
            role: role || 'user', // Default to 'user'
        };

        const result = await api.addUser(newUserPayload); // Use API to add user

        if (result.success) {
            setCurrentUser(result.user); // Log in the user immediately
            setLoading(false);
            return { success: true, user: result.user };
        } else {
            setLoading(false);
            return { success: false, message: result.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setCurrentUser(null);
        navigate('/login');
    };

    // Function to update currentUser if details change (e.g., admin edits user)
    // This is important if the currently logged-in user's data is modified by an admin
    const updateCurrentAuthUser = (updatedUserData) => {
        setCurrentUser(prevUser => ({...prevUser, ...updatedUserData}));
    }

    const value = {
        currentUser,
        loading,
        login,
        register,
        logout,
        updateCurrentAuthUser // Expose this
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};