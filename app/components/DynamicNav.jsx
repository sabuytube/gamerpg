'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import apiService from '@/lib/api';

export default function DynamicNav() {
  const { data: session, status } = useSession();
  const [hasCharacter, setHasCharacter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      checkCharacter();
    } else {
      setLoading(false);
    }
  }, [status]);

  const checkCharacter = async () => {
    try {
      const data = await apiService.get('character');
      setHasCharacter(!!data?.character);
    } catch (err) {
      setHasCharacter(false);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { href: '/', label: 'Home', show: true },
    { href: '/character/create', label: 'Create Character', show: !hasCharacter && status === 'authenticated' },
    { href: '/character/profile', label: 'Profile', show: hasCharacter && status === 'authenticated' },
    { href: '/map', label: 'Map', show: true },
    { href: '/stats', label: 'Systems', show: true },
  ];

  return (
    <>
      {navItems
        .filter(item => item.show)
        .map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-1.5 transition hover:bg-slate-800 hover:text-slate-100"
          >
            {link.label}
          </Link>
        ))}
    </>
  );
}
