'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, LogOut, Save, LogIn, UserPlus } from 'lucide-react';
import { getMe, updateProfile, loginUser, registerUser } from '@/services/api';

export default function ProfilePage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [profile, setProfile] = useState({ name: '', email: '', dosha: '', age: '' });
    const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', dosha: '' });
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('dhara_token');
        if (token) {
            getMe()
                .then((res) => {
                    setProfile({
                        name: res.data.name || '',
                        email: res.data.email || '',
                        dosha: res.data.dosha || '',
                        age: res.data.age?.toString() || '',
                    });
                    setIsLoggedIn(true);
                })
                .catch(() => {
                    localStorage.removeItem('dhara_token');
                    setIsLoggedIn(false);
                });
        }
    }, []);

    const handleLogin = async () => {
        setError('');
        try {
            const res = await loginUser({ email: authForm.email, password: authForm.password });
            localStorage.setItem('dhara_token', res.data.token);
            setProfile({ name: res.data.name, email: res.data.email, dosha: res.data.dosha || '', age: '' });
            setIsLoggedIn(true);
        } catch {
            setError('Invalid email or password');
        }
    };

    const handleRegister = async () => {
        setError('');
        if (authForm.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        try {
            const res = await registerUser({
                name: authForm.name,
                email: authForm.email,
                password: authForm.password,
                dosha: authForm.dosha,
            });
            localStorage.setItem('dhara_token', res.data.token);
            setProfile({ name: res.data.name, email: res.data.email, dosha: res.data.dosha || '', age: '' });
            setIsLoggedIn(true);
        } catch {
            setError('Registration failed. Email may already exist.');
        }
    };

    const handleSaveProfile = async () => {
        try {
            await updateProfile({
                name: profile.name,
                email: profile.email,
                dosha: profile.dosha,
                age: profile.age ? parseInt(profile.age) : undefined,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError('Failed to update profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('dhara_token');
        setIsLoggedIn(false);
        setProfile({ name: '', email: '', dosha: '', age: '' });
        router.push('/');
    };

    // ── Not Logged In ──
    if (!isLoggedIn) {
        return (
            <div className="max-w-md mx-auto px-6 py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="neu-card">
                    <div className="flex items-center gap-2 mb-6">
                        <User size={24} style={{ color: 'var(--accent)' }} />
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            {isRegister ? 'Create Account' : 'Sign In'}
                        </h1>
                    </div>

                    {error && (
                        <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ background: 'var(--danger)15', color: 'var(--danger)' }}>
                            {error}
                        </p>
                    )}

                    {isRegister && (
                        <div className="mb-4">
                            <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                            <input
                                type="text"
                                value={authForm.name}
                                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                                className="neu-input"
                                placeholder="Your name"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            value={authForm.email}
                            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                            className="neu-input"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={authForm.password}
                            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                            className="neu-input"
                            placeholder="••••••"
                        />
                    </div>

                    {isRegister && (
                        <div className="mb-6">
                            <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Dosha (optional)</label>
                            <select
                                value={authForm.dosha}
                                onChange={(e) => setAuthForm({ ...authForm, dosha: e.target.value })}
                                className="neu-input"
                            >
                                <option value="">Select Dosha</option>
                                <option value="Vata">Vata</option>
                                <option value="Pitta">Pitta</option>
                                <option value="Kapha">Kapha</option>
                            </select>
                        </div>
                    )}

                    <button
                        onClick={isRegister ? handleRegister : handleLogin}
                        className="neu-button-accent w-full flex items-center justify-center gap-2 mb-4"
                    >
                        {isRegister ? <><UserPlus size={16} /> Register</> : <><LogIn size={16} /> Sign In</>}
                    </button>

                    <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                            className="font-semibold cursor-pointer bg-transparent border-none"
                            style={{ color: 'var(--accent)' }}
                        >
                            {isRegister ? 'Sign In' : 'Register'}
                        </button>
                    </p>
                </motion.div>
            </div>
        );
    }

    // ── Logged In ──
    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-8"
                style={{ color: 'var(--text-primary)' }}
            >
                My Profile 👤
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="neu-card mb-6">
                {error && (
                    <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ background: 'var(--danger)15', color: 'var(--danger)' }}>
                        {error}
                    </p>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="neu-input"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="neu-input"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Dosha</label>
                        <select
                            value={profile.dosha}
                            onChange={(e) => setProfile({ ...profile, dosha: e.target.value })}
                            className="neu-input"
                        >
                            <option value="">Select Dosha</option>
                            <option value="Vata">Vata</option>
                            <option value="Pitta">Pitta</option>
                            <option value="Kapha">Kapha</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Age</label>
                        <input
                            type="number"
                            value={profile.age}
                            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                            className="neu-input"
                            placeholder="Age"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={handleSaveProfile} className="neu-button-accent inline-flex items-center gap-2">
                        <Save size={16} /> {saved ? '✅ Saved!' : 'Save Changes'}
                    </button>
                    <button onClick={handleLogout} className="neu-button inline-flex items-center gap-2" style={{ color: 'var(--danger)' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
