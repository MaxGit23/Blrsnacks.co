'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, type User } from '@/lib/api';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    googleLogin: (idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    const refreshUser = useCallback(async () => {
        try {
            const user = await authApi.getProfile();
            setState({ user, isLoading: false, isAuthenticated: true });
        } catch {
            setState({ user: null, isLoading: false, isAuthenticated: false });
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = useCallback(async (email: string, password: string) => {
        await authApi.login(email, password);
        await refreshUser();
    }, [refreshUser]);

    const register = useCallback(async (email: string, password: string) => {
        await authApi.register(email, password);
        await refreshUser();
    }, [refreshUser]);

    const googleLogin = useCallback(async (idToken: string) => {
        await authApi.googleAuth(idToken);
        await refreshUser();
    }, [refreshUser]);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            setState({ user: null, isLoading: false, isAuthenticated: false });
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ ...state, login, register, googleLogin, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
