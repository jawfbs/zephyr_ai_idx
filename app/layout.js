import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'ZephyrAI IDX - Find Your Dream Home',
  description: 'Beautiful real estate search portal powered by AI',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-50 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
