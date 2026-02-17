'use client';

import { motion } from 'framer-motion';
import { Wind, Flame, Droplets, Sparkles, Globe, Heart } from 'lucide-react';

const sections = [
    {
        title: 'Ancient Wisdom vs Modern Chaos',
        icon: Sparkles,
        content: `For thousands of years, Ayurveda — the "Science of Life" — guided entire civilizations toward 
    balance and well-being. Unlike modern medicine's "one-size-fits-all" approach, Ayurveda recognizes 
    that each person is unique. Your body constitution, mental patterns, and even the seasons of the year 
    all influence what keeps you healthy. In today's world of processed foods, constant stress, and 
    digital overload, this ancient wisdom has never been more relevant.`,
    },
    {
        title: 'The Five Elements (Pancha Mahabhutas)',
        icon: Globe,
        content: `Everything in the universe — including your body — is made up of five fundamental elements:
    
    🌍 Earth (Prithvi) — Structure, stability, bones and tissues
    💧 Water (Jala) — Fluidity, blood, digestive juices  
    🔥 Fire (Agni) — Transformation, metabolism, digestion
    💨 Air (Vayu) — Movement, breathing, nerve impulses
    ✨ Ether (Akasha) — Space, consciousness, the subtlest element
    
    These elements combine in pairs to form the three Doshas — the cornerstone of Ayurvedic understanding.`,
    },
];

const doshas = [
    {
        name: 'Vata',
        icon: Wind,
        elements: 'Air + Ether',
        color: '#7b68ee',
        traits: 'Creative, quick-thinking, energetic when balanced. Anxious, dry skin, irregular digestion when imbalanced.',
        tip: 'Favor warm, moist, grounding foods. Avoid raw, cold foods. Stick to routines.',
    },
    {
        name: 'Pitta',
        icon: Flame,
        elements: 'Fire + Water',
        color: '#e67e22',
        traits: 'Sharp intellect, strong digestion, natural leaders. Irritable, inflammatory issues, acid reflux when imbalanced.',
        tip: 'Favor cooling, sweet foods. Avoid spicy, fried foods. Practice moderation.',
    },
    {
        name: 'Kapha',
        icon: Droplets,
        elements: 'Water + Earth',
        color: '#27ae60',
        traits: 'Calm, loving, strong immunity when balanced. Lethargic, weight gain, congestion when imbalanced.',
        tip: 'Favor light, warm, spicy foods. Avoid heavy, oily foods. Stay active.',
    },
];

const modernProblems = [
    { title: 'Generic Advice', desc: 'Most health apps give the same advice to everyone, ignoring your unique body type.' },
    { title: 'No Safety Checks', desc: 'Herb-drug interactions are often ignored, putting users at real risk.' },
    { title: 'Information Overload', desc: 'Too much conflicting data without personalized guidance leads to confusion.' },
    { title: 'Missing Holistic View', desc: 'Modern apps focus on calories, not on the whole person — mind, body, spirit.' },
];

export default function WisdomPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
            >
                The Wisdom of Ayurveda 📜
            </motion.h1>
            <p className="mb-12 text-lg" style={{ color: 'var(--text-muted)' }}>
                A journey from ancient knowledge to modern wellness
            </p>

            {/* Story Sections */}
            {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                    <motion.section
                        key={section.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="neu-card mb-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Icon size={24} style={{ color: 'var(--accent)' }} />
                            <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{section.title}</h2>
                        </div>
                        <p className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                            {section.content}
                        </p>
                    </motion.section>
                );
            })}

            {/* Doshas */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    The Three Doshas
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {doshas.map((dosha) => {
                        const Icon = dosha.icon;
                        return (
                            <motion.div key={dosha.name} whileHover={{ y: -4 }} className="neu-card">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: dosha.color + '22' }}>
                                        <Icon size={20} style={{ color: dosha.color }} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold" style={{ color: dosha.color }}>{dosha.name}</h3>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{dosha.elements}</p>
                                    </div>
                                </div>
                                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{dosha.traits}</p>
                                <div className="neu-pressed p-3 rounded-xl">
                                    <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>💡 {dosha.tip}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            {/* Why Modern Apps Fail */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="neu-card mb-8"
            >
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Why Modern Health Apps Fall Short
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {modernProblems.map((prob) => (
                        <div key={prob.title} className="neu-pressed p-4 rounded-xl">
                            <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--danger)' }}>❌ {prob.title}</h4>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{prob.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* How Dhara is Different */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="neu-card"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Heart size={22} style={{ color: 'var(--accent)' }} />
                    <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        How Dhara is Different
                    </h2>
                </div>
                <div className="space-y-3">
                    {[
                        '✅ Personalized diet plans based on your Dosha',
                        '✅ Herb-medicine interaction safety checks',
                        '✅ Ancient wisdom presented in a modern, calm UI',
                        '✅ No medical diagnosis — decision support only',
                        '✅ Continuous learning through curated content',
                    ].map((point) => (
                        <p key={point} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {point}
                        </p>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
