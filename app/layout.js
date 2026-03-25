import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title:       'ZephyrAI IDX — Fargo Real Estate',
  description: 'AI-powered real estate platform for the Fargo ND area',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0, padding: 0 }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
