'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search as SearchIcon, Leaf } from 'lucide-react';
import { getHerbs, getMedicines } from '@/services/api';

interface SearchItem {
    id: number;
    name: string;
    type: 'herb' | 'medicine';
    detail: string;
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [items, setItems] = useState<SearchItem[]>([]);
    const [filtered, setFiltered] = useState<SearchItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getHerbs(), getMedicines()])
            .then(([herbRes, medRes]) => {
                const allItems: SearchItem[] = [
                    ...herbRes.data.map((h: { id: number; name: string; benefits: string }) => ({
                        id: h.id,
                        name: h.name,
                        type: 'herb' as const,
                        detail: h.benefits,
                    })),
                    ...medRes.data.map((m: { id: number; name: string; drug_class: string }) => ({
                        id: m.id,
                        name: m.name,
                        type: 'medicine' as const,
                        detail: m.drug_class,
                    })),
                ];
                setItems(allItems);
                setFiltered(allItems);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setFiltered(items);
        } else {
            const q = query.toLowerCase();
            setFiltered(items.filter((item) => item.name.toLowerCase().includes(q) || item.detail?.toLowerCase().includes(q)));
        }
    }, [query, items]);

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
            >
                Search 🔍
            </motion.h1>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Search herbs, medicines, and foods</p>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-8"
            >
                <SearchIcon
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search herbs, medicines, foods..."
                    className="neu-input pl-14 text-lg py-5"
                />
            </motion.div>

            {/* Results */}
            {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {filtered.length === 0 && (
                        <p style={{ color: 'var(--text-muted)' }}>No results found for &quot;{query}&quot;</p>
                    )}
                    {filtered.map((item, i) => (
                        <motion.div
                            key={`${item.type}-${item.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            {item.type === 'herb' ? (
                                <Link href={`/herbs/${item.id}`} className="block no-underline">
                                    <div className="neu-card flex items-center gap-4 cursor-pointer">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                                            <Leaf size={18} color="#fff" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.detail}</p>
                                        </div>
                                        <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'var(--safe)22', color: 'var(--safe)' }}>
                                            Herb
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="neu-card flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--caution)' }}>
                                        <span className="text-white text-sm font-bold">💊</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.detail}</p>
                                    </div>
                                    <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'var(--caution)22', color: 'var(--caution)' }}>
                                        Medicine
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
