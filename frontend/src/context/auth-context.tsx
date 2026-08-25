'use client';

// STATIC SITE MODE — authentication is disabled. The provider keeps the same
// interface (user state, login/register/logout) so UI code is unaffected, but
// all methods are local-only and never touch a backend.

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/lib/api';

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

const AUTH_DISABLED_MESSAGE = 'Authentication is disabled — this site runs in static mode without a backend.';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    const refreshUser = useCallback(async () => {
        setState({ user: null, isLoading: false, isAuthenticated: false });
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = useCallback(async () => {
        throw new Error(AUTH_DISABLED_MESSAGE);
    }, []);

    const register = useCallback(async () => {
        throw new Error(AUTH_DISABLED_MESSAGE);
    }, []);

    const googleLogin = useCallback(async () => {
        throw new Error(AUTH_DISABLED_MESSAGE);
    }, []);

    const logout = useCallback(async () => {
        setState({ user: null, isLoading: false, isAuthenticated: false });
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
