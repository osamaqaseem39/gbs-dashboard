import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef } from 'react';
import { User } from 'types';
import { authService } from 'services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken?: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_TOKEN'; payload: string };

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check for existing token
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken || state.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: User) => void;
  refreshAuthToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isRefreshing = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (token && storedUser) {
        try {
          dispatch({ type: 'AUTH_START' });
          // Try to verify token with backend
          const response = await authService.getCurrentUser();
          if (response.success && response.data?.user) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { 
                user: response.data.user, 
                token,
                refreshToken: storedRefreshToken || undefined,
              },
            });
          } else {
            // If verification fails, try to refresh token
            if (storedRefreshToken) {
              const refreshed = await refreshAuthToken();
              if (!refreshed) {
                // If refresh fails, clear storage and logout
                clearAuthStorage();
                dispatch({ type: 'AUTH_LOGOUT' });
              }
            } else {
              clearAuthStorage();
              dispatch({ type: 'AUTH_LOGOUT' });
            }
          }
        } catch (error: any) {
          // If verification fails with 401, try to refresh token
          if (error.response?.status === 401 && storedRefreshToken) {
            const refreshed = await refreshAuthToken();
            if (!refreshed) {
              clearAuthStorage();
              dispatch({ type: 'AUTH_LOGOUT' });
            }
          } else {
            clearAuthStorage();
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  };

  const refreshAuthToken = async (): Promise<boolean> => {
    if (isRefreshing.current) {
      return false;
    }

    const storedRefreshToken = localStorage.getItem('refreshToken') || state.refreshToken;
    if (!storedRefreshToken) {
      return false;
    }

    try {
      isRefreshing.current = true;
      const response = await authService.refreshToken();
      if (response.success && response.data) {
        const { token, accessToken } = response.data as any;
        const newToken = accessToken || token;
        if (newToken) {
          localStorage.setItem('token', newToken);
          dispatch({ type: 'UPDATE_TOKEN', payload: newToken });
          isRefreshing.current = false;
          return true;
        }
      }
      isRefreshing.current = false;
      return false;
    } catch (error) {
      isRefreshing.current = false;
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        const { user, token, accessToken, refreshToken } = response.data;
        // Use accessToken if available, otherwise use token
        const authToken = accessToken || token;
        if (!authToken) {
          throw new Error('No token received from server');
        }
        
        // Store tokens
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { 
            user, 
            token: authToken,
            refreshToken: refreshToken || undefined,
          } 
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Login failed' });
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      console.log('AuthContext.register called with:', userData);
      dispatch({ type: 'AUTH_START' });
      const response = await authService.register(userData);
      console.log('AuthContext received response:', response);
      if (response.success && response.data) {
        const { user, token, accessToken, refreshToken } = response.data;
        // Use accessToken if available, otherwise use token
        const authToken = accessToken || token;
        if (!authToken) {
          throw new Error('No token received from server');
        }
        
        // Store tokens
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { 
            user, 
            token: authToken,
            refreshToken: refreshToken || undefined,
          } 
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Registration failed' });
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('AuthContext.register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const logout = () => {
    // Clear all auth data
    clearAuthStorage();
    dispatch({ type: 'AUTH_LOGOUT' });
    // Use window.location for a full page reload to clear all state
    // This ensures all contexts and components are reset
    window.location.href = '/login';
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    localStorage.setItem('user', JSON.stringify(user));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
    refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
