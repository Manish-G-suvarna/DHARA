'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Leaf, Shield, AlertTriangle } from 'lucide-react';
import { getHerbById, getMedicines, checkInteraction } from '@/services/api';

interface Herb {
    id: number;
    name: string;
    dosha: string;
    benefits: string;
    safety_notes: string;
}

interface Medicine {
    id: number;
    name: string;
    drug_class: string;
}

interface InteractionResult {
    found: boolean;
    risk_level: string;
    explanation?: string;
    message?: string;
}

export default function HerbDetailPage() {
    const params = useParams();
    const [herb, setHerb] = useState<Herb | null>(null);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null);
    const [interaction, setInteraction] = useState<InteractionResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = Number(params.id);
        Promise.all([getHerbById(id), getMedicines()])
            .then(([herbRes, medRes]) => {
                setHerb(herbRes.data);
                setMedicines(medRes.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [params.id]);

    const handleCheckInteraction = async (medId: number) => {
        if (!herb) return;
        setSelectedMedicine(medId);
        try {
            const res = await checkInteraction(herb.id, medId);
            setInteraction(res.data);
        } catch {
            setInteraction(null);
        }
    };

    const riskColor = (level: string) => {
        switch (level) {
            case 'AVOID': return 'var(--danger)';
            case 'CAUTION': return 'var(--caution)';
            default: return 'var(--safe)';
        }
    };

    if (loading) return <div className="p-10" style={{ color: 'var(--text-muted)' }}>Loading...</div>;
    if (!herb) return <div className="p-10" style={{ color: 'var(--text-muted)' }}>Herb not found.</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <Link href="/herbs" className="inline-flex items-center gap-2 mb-6 no-underline" style={{ color: 'var(--accent)' }}>
                <ArrowLeft size={18} /> Back to Herbs
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="neu-card mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                        <Leaf size={24} color="#fff" />
                    </div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{herb.name}</h1>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {herb.dosha?.split(',').map((d) => (
                        <span key={d.trim()} className="text-sm font-semibold px-4 py-1 rounded-full" style={{ background: 'var(--accent)22', color: 'var(--accent)' }}>
                            {d.trim()}
                        </span>
                    ))}
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Benefits</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{herb.benefits}</p>
                </div>

                {herb.safety_notes && (
                    <div className="neu-pressed p-4 rounded-xl flex items-start gap-3">
                        <Shield size={20} style={{ color: 'var(--caution)', flexShrink: 0 }} />
                        <div>
                            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--caution)' }}>Safety Notes</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{herb.safety_notes}</p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Interaction Checker */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="neu-card">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={20} style={{ color: 'var(--caution)' }} />
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Medicine Interaction Check</h2>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    Select a medicine to check for interactions with {herb.name}.
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                    {medicines.map((med) => (
                        <button
                            key={med.id}
                            onClick={() => handleCheckInteraction(med.id)}
                            className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
                            style={{
                                background: selectedMedicine === med.id ? 'var(--accent)' : 'var(--bg-primary)',
                                color: selectedMedicine === med.id ? '#fff' : 'var(--text-secondary)',
                                boxShadow: selectedMedicine === med.id
                                    ? 'inset 3px 3px 6px rgba(0,0,0,0.15)'
                                    : '3px 3px 6px var(--shadow-dark), -3px -3px 6px var(--shadow-light)',
                            }}
                        >
                            {med.name}
                        </button>
                    ))}
                </div>

                {interaction && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neu-pressed p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full" style={{ background: riskColor(interaction.risk_level) }} />
                            <span className="font-bold" style={{ color: riskColor(interaction.risk_level) }}>
                                {interaction.risk_level}
                            </span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {interaction.explanation || interaction.message}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
