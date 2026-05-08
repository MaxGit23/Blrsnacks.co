'use client';

import { useCountUp } from '@/hooks';

const stats = [
  { value: 15000, suffix: '+', label: 'Happy Customers' },
  { value: 50, suffix: '+', label: 'Handcrafted Snacks' },
  { value: 98, suffix: '%', label: 'On-time Delivery' },
  { value: 100, suffix: '%', label: 'Natural Ingredients' },
];

function StatItem({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { count, ref } = useCountUp(value, 2000);

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
    return n.toString();
  };

  return (
    <div
      ref={ref}
      className={`glass-dark rounded-2xl p-5 reveal reveal-delay-${delay}`}
    >
      <div className="text-2xl md:text-3xl font-bold text-amber-400 font-display tabular-nums">
        {formatCount(count)}{suffix}
      </div>
      <div className="text-sm text-stone-400 font-body">{label}</div>
    </div>
  );
}

export function AnimatedStats() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <StatItem key={stat.label} {...stat} delay={i + 1} />
      ))}
    </div>
  );
}
