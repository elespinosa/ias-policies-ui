import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  setResolvedTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      resolvedTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      setTheme: (theme) => {
        set({ theme });
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
          set({ resolvedTheme: systemTheme });
        } else {
          root.classList.add(theme);
          set({ resolvedTheme: theme });
        }

        // Notify host if available
        if (window.__REMOTE_THEME__) {
          window.__REMOTE_THEME__.setTheme(theme);
        }
      },
      setResolvedTheme: (theme) => {
        set({ resolvedTheme: theme });
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
); 