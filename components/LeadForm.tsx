'use client';
import { useState } from 'react';

interface Props {
  fields: string[];
  ctaText: string;
  brandColor: string;
  tenantId: string;
  slug: string;
}

export function LeadForm({ fields, ctaText, brandColor, tenantId, slug }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const LABELS: Record<string, string> = {
    name:    'Full Name',
    email:   'Email Address',
    phone:   'Phone Number',
    company: 'Company',
    title:   'Job Title',
    zip:     'ZIP Code',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const ENGINE = process.env.NEXT_PUBLIC_ENGINE_URL ?? 'http://localhost:8080';
      const res = await fetch(`${ENGINE}/leads/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
        body: JSON.stringify({
          first_name: (values.name ?? '').split(' ')[0],
          last_name:  (values.name ?? '').split(' ').slice(1).join(' '),
          email:      values.email ?? '',
          phone:      values.phone ?? '',
          company:    values.company ?? '',
          title:      values.title ?? '',
          source:     `campaign:${slug}`,
          raw: values,
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✓</div>
        <p className="text-lg font-semibold text-gray-900">You're in!</p>
        <p className="text-gray-500 text-sm mt-1">We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LABELS[field] ?? field}
          </label>
          <input
            type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
            required={field === 'email' || field === 'name'}
            value={values[field] ?? ''}
            onChange={e => setValues(v => ({ ...v, [field]: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
            style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
          />
        </div>
      ))}

      {status === 'error' && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3.5 rounded-lg text-white font-semibold text-sm tracking-wide transition-opacity disabled:opacity-60"
        style={{ backgroundColor: brandColor }}
      >
        {status === 'sending' ? 'Submitting…' : ctaText}
      </button>

      <p className="text-xs text-gray-400 text-center">
        No spam. Your info is never sold.
      </p>
    </form>
  );
}
