import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  phone: string;
  name?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  verifyUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const storedUser = localStorage.getItem('shram_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.isVerified) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (phone: string, name?: string) => {
    const newUser: User = {
      phone,
      name,
      isVerified: false
    };
    setUser(newUser);
    localStorage.setItem('shram_user', JSON.stringify(newUser));
  };

  const verifyUser = () => {
    if (user) {
      const verifiedUser: User = {
        ...user,
        isVerified: true
      };
      setUser(verifiedUser);
      setIsAuthenticated(true);
      localStorage.setItem('shram_user', JSON.stringify(verifiedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('shram_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    verifyUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};