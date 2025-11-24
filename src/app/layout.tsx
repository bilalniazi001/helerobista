// app/layout.tsx
import React from 'react'; 
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

interface RootLayoutProps {
  children: React.ReactNode; 
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}