// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  // Add other user-related data here (e.g., userId, roles)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  const value: AuthContextType = {
    username,
    setUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// import React, { createContext, useState, useContext, ReactNode } from 'react';

// interface AuthContextType {
//   username: string | null;
//   setUsername: React.Dispatch<React.SetStateAction<string | null>>;
//   // Add other user-related data here (e.g., userId, roles)
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [username, setUsername] = useState<string | null>(null);

//   const value: AuthContextType = {
//     username,
//     setUsername,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };