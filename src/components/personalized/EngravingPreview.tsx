'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteConfig, type PersonalizationOption } from '@/config/site';

const EASE = [0.22, 1, 0.36, 1] as const;

const LABELS: Record<PersonalizationOption, string> = {
  initials: 'Initials',
  date: 'Date',
  text: 'Custom text',
  birthstone: 'Birthstone',
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d} · ${m} · ${y}` : '';
}

/**
 * Live preview of an engraved disc pendant. It is a visual guide only: the options listed are
 * the ones configured in siteConfig.personalization, and nothing here places an order.
 */
export function EngravingPreview({ compact = false }: { compact?: boolean }) {
  const { options, maxCharacters, birthstones } = siteConfig.personalization;
  const reduce = useReducedMotion();
  const uid = useId();
  const [mode, setMode] = useState<PersonalizationOption>(options[0] ?? 'initials');
  const [initials, setInitials] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [stone, setStone] = useState(birthstones[0]?.month ?? '');

  if (options.length === 0) return null;

  const engraving =
    mode === 'initials' ? initials.toUpperCase() || 'A·R' : mode === 'date' ? formatDate(date) || '06 · 11 · 2026' : mode === 'text' ? text || 'Always' : '';
  const birthstone = birthstones.find((b) => b.month === stone);
  const fontSize = mode === 'initials' ? 46 : mode === 'date' ? 17 : Math.max(16, 34 - engraving.length * 1.4);

  const field = 'mt-2 w-full border border-line bg-white px-4 py-3 text-sm text-espresso focus:border-gold-deep focus:outline-none';

  return (
    <div className={`grid items-center gap-10 ${compact ? 'md:grid-cols-2' : 'lg:grid-cols-2 lg:gap-16'}`}>
      {/* Pendant */}
      <div className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden>
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,#fffaf2_0%,#efe3d2_55%,#e9ded1_100%)]" />
        <svg viewBox="0 0 200 200" className="relative h-full w-full">
          <defs>
            <radialGradient id={`${uid}-gold`} cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#f3e2c2" />
              <stop offset="45%" stopColor="#d8c1a0" />
              <stop offset="100%" stopColor="#a98455" />
            </radialGradient>
          </defs>
          <path d="M100 8 C 70 30, 70 30, 100 52 M100 8 C 130 30, 130 30, 100 52" fill="none" stroke="#a98455" strokeWidth="0.8" opacity="0.7" />
          <circle cx="100" cy="56" r="5" fill="none" stroke="#a98455" strokeWidth="2" />
          <circle cx="100" cy="122" r="62" fill={`url(#${uid}-gold)`} />
          <circle cx="100" cy="122" r="56" fill="none" stroke="#fff6e6" strokeWidth="0.6" opacity="0.7" />
          {mode === 'birthstone' && birthstone && <circle cx="100" cy="122" r="10" fill={birthstone.colour} stroke="#fff6e6" strokeWidth="1.5" />}
        </svg>
        <div className="absolute inset-x-0 top-[61%] flex -translate-y-1/2 justify-center px-[26%]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${mode}-${engraving}`}
              initial={reduce ? false : { opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ fontSize, textShadow: '0 1px 0 rgba(255,246,230,0.6), 0 -1px 0 rgba(73,56,47,0.35)' }}
              className="whitespace-nowrap text-center font-heading italic text-[#6b4f2e]"
            >
              {engraving}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div>
        <fieldset>
          <legend className="eyebrow">Choose a personalisation</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {options.map((o) => (
              <label key={o} className="cursor-pointer">
                <input type="radio" name={`${uid}-mode`} value={o} checked={mode === o} onChange={() => setMode(o)} className="peer sr-only" />
                <span className="inline-block border border-line px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso transition-colors peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep">
                  {LABELS[o]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8">
          {mode === 'initials' && (
            <label className="block text-sm text-espresso">
              Initials (up to 3 letters)
              <input value={initials} maxLength={3} onChange={(e) => setInitials(e.target.value.replace(/[^a-zA-Z]/g, ''))} className={field} />
            </label>
          )}
          {mode === 'date' && (
            <label className="block text-sm text-espresso">
              A date to remember
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
            </label>
          )}
          {mode === 'text' && (
            <label className="block text-sm text-espresso">
              Your words (up to {maxCharacters} characters)
              <input value={text} maxLength={maxCharacters} onChange={(e) => setText(e.target.value)} className={field} />
              <span className="mt-1 block text-right text-xs text-muted">
                {text.length}/{maxCharacters}
              </span>
            </label>
          )}
          {mode === 'birthstone' &&
            (birthstones.length > 0 ? (
              <label className="block text-sm text-espresso">
                Birth month
                <select value={stone} onChange={(e) => setStone(e.target.value)} className={field}>
                  {birthstones.map((b) => (
                    <option key={b.month} value={b.month}>
                      {b.month} · {b.stone}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="text-sm text-muted">Birthstone choices will be listed here once configured.</p>
            ))}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Preview for illustration only. Final lettering, size and placement depend on the piece you choose.
        </p>
      </div>
    </div>
  );
}
