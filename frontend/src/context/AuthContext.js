import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('polluxkart-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('polluxkart-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('polluxkart-user');
    }
  }, [user]);

  const login = async (identifier, password, method = 'email') => {
    setIsLoading(true);
    // Mock login - simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isEmail = method === 'email';
    const mockUser = {
      id: '1',
      name: isEmail ? identifier.split('@')[0] : `User${identifier.slice(-4)}`,
      email: isEmail ? identifier : null,
      phone: isEmail ? null : identifier,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${identifier}`,
    };
    setUser(mockUser);
    setIsLoading(false);
    return mockUser;
  };

  const signup = async (name, email, phone, password) => {
    setIsLoading(true);
    // Mock signup - simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: Date.now().toString(),
      name,
      email: email || null,
      phone,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    };
    setUser(mockUser);
    setIsLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
