'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-3 mb-6"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: 'var(--accent)',
            boxShadow: '6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light)',
          }}
        >
          <Leaf size={32} color="#fff" />
        </div>
        <h1
          className="text-5xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-outfit)' }}
        >
          Dhara
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-xl mb-4 text-center"
        style={{ color: 'var(--text-secondary)' }}
      >
        Ancient balance for modern life
      </motion.p>

      {/* Intro */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="max-w-lg text-center mb-10 leading-relaxed"
        style={{ color: 'var(--text-muted)' }}
      >
        Discover the wisdom of Ayurveda — personalized diet plans, herb safety checks,
        and ancient wellness insights, all in one modern platform.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Link
          href="/home"
          className="neu-button-accent inline-flex items-center gap-2 text-lg px-8 py-4 rounded-2xl no-underline"
        >
          Get Started <ArrowRight size={20} />
        </Link>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 flex gap-4"
      >
        {['🌿', '🧘', '🍃', '☯️', '🌱'].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: 'easeInOut' }}
            className="text-3xl"
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
