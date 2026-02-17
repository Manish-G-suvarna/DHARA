'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Shield, Lightbulb } from 'lucide-react';
import { getHerbs } from '@/services/api';

const tips = [
    "Start your day with warm water and lemon to ignite your digestive fire (Agni).",
    "Practice 10 minutes of Pranayama breathing before meals.",
    "Tulsi tea in the evening calms Vata and promotes restful sleep.",
    "Avoid combining milk with sour fruits — it creates Ama (toxins).",
    "Eat your largest meal at lunch when Pitta (digestive fire) is strongest.",
];

interface HerbData {
    id: number;
    name: string;
    safety_notes: string;
}

export default function HomePage() {
    const [tip, setTip] = useState('');
    const [herbs, setHerbs] = useState<HerbData[]>([]);

    useEffect(() => {
        setTip(tips[Math.floor(Math.random() * tips.length)]);
        getHerbs()
            .then((res) => setHerbs(res.data.slice(0, 3)))
            .catch(() => { });
    }, []);

    const meals = {
        breakfast: '🥣 Warm oatmeal with turmeric, topped with almonds and honey',
        lunch: '🍛 Khichdi with seasonal vegetables and ghee',
        dinner: '🥗 Light mung dal soup with steamed greens',
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-8"
                style={{ color: 'var(--text-primary)' }}
            >
                Welcome to Dhara 🌿
            </motion.h1>

            {/* Today's Diet Plan */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="neu-card mb-8"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Sun size={22} style={{ color: 'var(--accent)' }} />
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Today&apos;s Diet Plan
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(meals).map(([meal, desc]) => (
                        <div key={meal} className="neu-pressed p-4 rounded-xl">
                            <h3 className="font-semibold capitalize mb-2" style={{ color: 'var(--accent)' }}>
                                {meal}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Safety Alerts */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="neu-card mb-8"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Shield size={22} style={{ color: 'var(--caution)' }} />
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Herb Safety Alerts
                    </h2>
                </div>
                {herbs.length > 0 ? (
                    <div className="space-y-3">
                        {herbs.map((herb) => (
                            <div key={herb.id} className="neu-pressed p-3 rounded-xl flex items-start gap-3">
                                <span className="text-lg">⚠️</span>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                        {herb.name}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        {herb.safety_notes}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Loading herbs...
                    </p>
                )}
            </motion.section>

            {/* Daily Tip */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="neu-card"
            >
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={22} style={{ color: 'var(--accent)' }} />
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Daily Ayurveda Tip
                    </h2>
                </div>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {tip}
                </p>
            </motion.section>
        </div>
    );
}
