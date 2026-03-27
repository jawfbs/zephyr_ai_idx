'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function AuthProvider({ children }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

export function UserSync() {
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      // Sync favorites from local storage to server/database
      const localFavorites = localStorage.getItem('favorites');
      if (localFavorites) {
        // Here you would typically call your API to save favorites for the user
        // For now, we'll just keep them in localStorage
        console.log('User logged in:', user.id);
      }
    }
  }, [user]);

  return null;
}
