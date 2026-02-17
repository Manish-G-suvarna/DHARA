'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Leaf, Search, UtensilsCrossed, BookOpen, User } from 'lucide-react';

const navItems = [
    { href: '/home', label: 'HOME', icon: Home },
    { href: '/herbs', label: 'HERBS', icon: Leaf },
    { href: '/search', label: 'SEARCH', icon: Search },
    { href: '/diet', label: 'DIET PLAN', icon: UtensilsCrossed },
    { href: '/wisdom', label: 'WISDOM', icon: BookOpen },
    { href: '/profile', label: 'PROFILE', icon: User },
];

export default function Navbar() {
    const pathname = usePathname();

    // Hide on landing page
    if (pathname === '/') return null;

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 px-6 py-4"
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between neu-flat px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
                        🌿 Dhara
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive
                                        ? 'text-white'
                                        : 'hover:opacity-80'
                                    }`}
                                style={{
                                    color: isActive ? '#fff' : 'var(--text-secondary)',
                                    background: isActive ? 'var(--accent)' : 'transparent',
                                    boxShadow: isActive
                                        ? 'inset 2px 2px 4px rgba(0,0,0,0.15), inset -2px -2px 4px rgba(255,255,255,0.1)'
                                        : 'none',
                                }}
                            >
                                <Icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile menu icon (simplified) */}
                <div className="md:hidden flex items-center gap-2">
                    <Link href="/home" className="p-2 rounded-lg" style={{ color: 'var(--accent)' }}>
                        <Home size={20} />
                    </Link>
                    <Link href="/herbs" className="p-2 rounded-lg" style={{ color: 'var(--accent)' }}>
                        <Leaf size={20} />
                    </Link>
                    <Link href="/search" className="p-2 rounded-lg" style={{ color: 'var(--accent)' }}>
                        <Search size={20} />
                    </Link>
                    <Link href="/profile" className="p-2 rounded-lg" style={{ color: 'var(--accent)' }}>
                        <User size={20} />
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
