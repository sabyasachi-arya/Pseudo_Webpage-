import React from 'react';

export default function Placeholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-xl font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/65">{subtitle}</div>
    </div>
  );
}
