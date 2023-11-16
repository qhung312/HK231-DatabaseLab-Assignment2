import './globals.css';
import type { Metadata } from 'next';
import { ReduxProvider } from '@/store/provider';
import NavBar from '@/components/NavBar';
import { ConfigProvider } from 'antd';
import { CookiesProvider } from 'next-client-cookies/server';

export const metadata: Metadata = {
  title: 'Quarantine Camp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/HCMUT_official_logo.ico"></link>
      </head>
      <body>
        <CookiesProvider>
          <ReduxProvider>
            <ConfigProvider
            >
              <NavBar />
              {children}
            </ConfigProvider>
          </ReduxProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
