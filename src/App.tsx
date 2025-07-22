import React, { useEffect } from "react";
import { useThemeStore } from './store/themeStore';
import Policies from "./pages/Policies";

declare global {
  interface Window {
    __REMOTE_THEME__?: {
      getTheme: () => 'light' | 'dark' | 'system';
      setTheme: (theme: 'light' | 'dark' | 'system') => void;
    };
  }
}

const App: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useThemeStore();

  // Initialize theme control for host
  useEffect(() => {
    window.__REMOTE_THEME__ = {
      getTheme: () => theme,
      setTheme: (newTheme) => {
        setTheme(newTheme);
      }
    };
  }, [theme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        useThemeStore.getState().setResolvedTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme classes to root element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <div 
      className={`app-container ${resolvedTheme}`}
      style={{ 
        width: '100%', 
        height: '100%', 
        boxSizing: 'border-box', 
        padding: 0, 
        margin: 0 
      }}
    >
      <Policies />
    </div>
  );
};

export default App;
