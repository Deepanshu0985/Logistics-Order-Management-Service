import api from "./axios";

// Register a new user
export const register = (data) => {
    return api.post("/auth/register", data);
};

// Login
export const login = (data) => {
    return api.post("/auth/login", data);
};

// Get current user from token (decode JWT)
export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = JSON.parse(localStorage.getItem("user"));
        return {
            ...user,
            tokenExpiry: payload.exp * 1000
        };
    } catch {
        return null;
    }
};

// Check if token is expired
export const isTokenExpired = () => {
    const user = getCurrentUser();
    if (!user) return true;
    return Date.now() > user.tokenExpiry;
};

// Logout
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Save auth data
export const saveAuth = (authResponse) => {
    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("user", JSON.stringify({
        id: authResponse.userId,
        name: authResponse.name,
        email: authResponse.email,
        role: authResponse.role
    }));
};
