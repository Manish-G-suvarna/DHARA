'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { getHerbs } from '@/services/api';

interface Herb {
    id: number;
    name: string;
    dosha: string;
    benefits: string;
    safety_notes: string;
}

export default function HerbsPage() {
    const [herbs, setHerbs] = useState<Herb[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHerbs()
            .then((res) => setHerbs(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const doshaColor = (dosha: string) => {
        if (dosha?.toLowerCase().includes('vata')) return '#7b68ee';
        if (dosha?.toLowerCase().includes('pitta')) return '#e67e22';
        if (dosha?.toLowerCase().includes('kapha')) return '#27ae60';
        return 'var(--accent)';
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
            >
                Herb Catalog 🌿
            </motion.h1>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
                Explore Ayurvedic herbs and their benefits
            </p>

            {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading herbs...</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {herbs.map((herb, i) => (
                        <motion.div
                            key={herb.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={`/herbs/${herb.id}`} className="block no-underline">
                                <div className="neu-card cursor-pointer group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                background: 'var(--accent)',
                                                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.1)',
                                            }}
                                        >
                                            <Leaf size={20} color="#fff" />
                                        </div>
                                        <h2
                                            className="text-lg font-semibold group-hover:underline"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {herb.name}
                                        </h2>
                                    </div>

                                    {/* Dosha tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {herb.dosha?.split(',').map((d) => (
                                            <span
                                                key={d.trim()}
                                                className="text-xs font-semibold px-3 py-1 rounded-full"
                                                style={{
                                                    background: doshaColor(d) + '22',
                                                    color: doshaColor(d),
                                                    border: `1px solid ${doshaColor(d)}44`,
                                                }}
                                            >
                                                {d.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Benefits */}
                                    <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                        {herb.benefits}
                                    </p>

                                    {/* Safety note */}
                                    {herb.safety_notes && (
                                        <div
                                            className="text-xs px-3 py-2 rounded-lg"
                                            style={{
                                                background: 'var(--caution)' + '15',
                                                color: 'var(--caution)',
                                                border: '1px solid var(--caution)' + '33',
                                            }}
                                        >
                                            ⚠️ {herb.safety_notes}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
