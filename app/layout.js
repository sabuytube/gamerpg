import Link from 'next/link';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import AuthButton from '@/components/AuthButton';

export const metadata = {
  title: 'GameRPG',
  description: 'A modular RPG sandbox built with Next.js App Router and Tailwind CSS.',
};

const primaryNav = [
  { href: '/', label: 'Home' },
  { href: '/character/create', label: 'Create Character' },
  { href: '/game', label: 'Game' },
  { href: '/map', label: 'Map' },
  { href: '/stats', label: 'Systems' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-100">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
              <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-sm">
                <Link href="/" className="font-semibold tracking-tight text-slate-100">
                  GameRPG
                </Link>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 text-slate-300">
                    {primaryNav.map((link) => (
                      <Link key={link.href} href={link.href} className="rounded-lg px-3 py-1.5 transition hover:bg-slate-800 hover:text-slate-100">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <AuthButton />
                </div>
              </nav>
            </header>
            <div className="flex-1">{children}</div>
            <footer className="border-t border-slate-800 bg-slate-950/80">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 text-xs text-slate-500">
                <span>&copy; {new Date().getFullYear()} GameRPG Sandbox</span>
                <span>Next.js | Tailwind CSS | React Hooks</span>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}