import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AuthProvider } from '@/lib/auth';
import { SettingsProvider } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'LeadGenius AI',
  description: 'AI-powered Google Maps lead scraper, scorer, and sales automation CRM.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SettingsProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
