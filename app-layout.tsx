// app/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tarot Light Path - Script Generator',
  description: 'Generate YouTube tarot reading scripts semi-live',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">
                Tarot Light Path — Script Generator
              </h1>
              <div className="text-sm text-slate-500">
                <a href="/settings" className="hover:text-primary">Settings</a>
              </div>
            </div>
          </header>
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-slate-100 border-t border-slate-200 text-center py-4 text-sm text-slate-600">
            <p>Built for Tarot Light Path with Tim B. | Next.js 16 + OpenAI</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
