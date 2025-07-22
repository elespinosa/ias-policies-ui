import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StyleSheetManager } from 'styled-components'
import './lib/i18n' // Import i18n configuration
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const rootElement = document.getElementById("root");
const queryClient = new QueryClient();

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyleSheetManager>
        <Toaster />
        <Sonner 
          position="top-right"
          expand={false}
          richColors
          closeButton
          theme="system"/>
        <App />
      </StyleSheetManager>
    </QueryClientProvider>
  </React.StrictMode>
);
