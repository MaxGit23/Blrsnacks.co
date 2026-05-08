'use client';

import { useScrollReveal } from '@/hooks';

export function ScrollRevealWrapper({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
