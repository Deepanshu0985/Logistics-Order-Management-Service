import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, isTokenExpired, logout as apiLogout, saveAuth } from "../api/auth.api";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const currentUser = getCurrentUser();
        if (currentUser && !isTokenExpired()) {
            setUser(currentUser);
        } else if (currentUser) {
            // Token expired, clear it
            apiLogout();
        }
        setLoading(false);
    }, []);

    const login = (authResponse) => {
        saveAuth(authResponse);
        setUser({
            id: authResponse.userId,
            name: authResponse.name,
            email: authResponse.email,
            role: authResponse.role
        });
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
