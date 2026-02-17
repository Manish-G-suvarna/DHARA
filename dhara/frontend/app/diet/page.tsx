'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDietPlan, saveDietPlan } from '@/services/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultPlan: Record<string, { breakfast: string; lunch: string; dinner: string }> = {
    Monday: { breakfast: 'Warm oatmeal with turmeric', lunch: 'Khichdi with veggies', dinner: 'Mung dal soup' },
    Tuesday: { breakfast: 'Poha with peanuts', lunch: 'Rice with sambar', dinner: 'Chapati with mixed sabzi' },
    Wednesday: { breakfast: 'Idli with coconut chutney', lunch: 'Quinoa salad with herbs', dinner: 'Vegetable stew' },
    Thursday: { breakfast: 'Smoothie with ashwagandha', lunch: 'Dal tadka with rice', dinner: 'Light salad with nuts' },
    Friday: { breakfast: 'Upma with ghee', lunch: 'Rajma chawal', dinner: 'Soup with whole wheat bread' },
    Saturday: { breakfast: 'Besan chilla with chutney', lunch: 'Chole with rice', dinner: 'Khichdi with buttermilk' },
    Sunday: { breakfast: 'Stuffed paratha with curd', lunch: 'Thali - balanced meal', dinner: 'Fruit bowl with honey' },
};

export default function DietPage() {
    const [plan, setPlan] = useState(defaultPlan);
    const [activeDay, setActiveDay] = useState(0);
    const [saved, setSaved] = useState(false);
    const [showPrefs, setShowPrefs] = useState(false);
    const [prefs, setPrefs] = useState({ type: 'veg', allergies: '', fasting: false });

    useEffect(() => {
        getDietPlan()
            .then((res) => {
                if (res.data?.plan) {
                    setPlan(res.data.plan);
                }
            })
            .catch(() => {
                // No plan yet, use default
                setShowPrefs(true);
            });
    }, []);

    const handleSave = async () => {
        try {
            const today = new Date();
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1);
            const weekStart = new Date(today.setDate(diff)).toISOString().split('T')[0];

            await saveDietPlan({ week_start: weekStart, plan });
            setSaved(true);
            setShowPrefs(false);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            alert('Please log in to save your diet plan.');
        }
    };

    const updateMeal = (day: string, meal: string, value: string) => {
        setPlan((prev) => ({
            ...prev,
            [day]: { ...prev[day], [meal]: value },
        }));
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
            >
                Weekly Diet Plan 🍽️
            </motion.h1>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
                Personalized Ayurvedic meals for the week
            </p>

            {/* Preferences (first visit) */}
            {showPrefs && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="neu-card mb-8">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Set Your Preferences
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Diet Type</label>
                            <select
                                value={prefs.type}
                                onChange={(e) => setPrefs({ ...prefs, type: e.target.value })}
                                className="neu-input"
                            >
                                <option value="veg">Vegetarian</option>
                                <option value="non-veg">Non-Vegetarian</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Allergies</label>
                            <input
                                type="text"
                                value={prefs.allergies}
                                onChange={(e) => setPrefs({ ...prefs, allergies: e.target.value })}
                                placeholder="e.g. nuts, dairy"
                                className="neu-input"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={prefs.fasting}
                                    onChange={(e) => setPrefs({ ...prefs, fasting: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fasting days</span>
                            </label>
                        </div>
                    </div>
                    <button onClick={() => setShowPrefs(false)} className="neu-button-accent text-sm">
                        Generate Plan
                    </button>
                </motion.div>
            )}

            {/* Day Navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setActiveDay(Math.max(0, activeDay - 1))}
                    className="neu-button p-2 rounded-xl"
                    disabled={activeDay === 0}
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2 overflow-x-auto">
                    {days.map((day, i) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(i)}
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
                            style={{
                                background: activeDay === i ? 'var(--accent)' : 'var(--bg-primary)',
                                color: activeDay === i ? '#fff' : 'var(--text-secondary)',
                                boxShadow: activeDay === i
                                    ? 'inset 2px 2px 4px rgba(0,0,0,0.15)'
                                    : '3px 3px 6px var(--shadow-dark), -3px -3px 6px var(--shadow-light)',
                            }}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setActiveDay(Math.min(6, activeDay + 1))}
                    className="neu-button p-2 rounded-xl"
                    disabled={activeDay === 6}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Day Plan */}
            <motion.div
                key={activeDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="neu-card"
            >
                <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                    {days[activeDay]}
                </h2>

                {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    <div key={meal} className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                            <UtensilsCrossed size={16} style={{ color: 'var(--accent)' }} />
                            <label className="text-sm font-semibold capitalize" style={{ color: 'var(--text-secondary)' }}>
                                {meal}
                            </label>
                        </div>
                        <input
                            type="text"
                            value={plan[days[activeDay]]?.[meal as keyof typeof plan[typeof days[0]]] || ''}
                            onChange={(e) => updateMeal(days[activeDay], meal, e.target.value)}
                            className="neu-input"
                        />
                    </div>
                ))}

                <button onClick={handleSave} className="neu-button-accent inline-flex items-center gap-2 mt-2">
                    <Save size={16} /> {saved ? '✅ Saved!' : 'Save Plan'}
                </button>
            </motion.div>
        </div>
    );
}
