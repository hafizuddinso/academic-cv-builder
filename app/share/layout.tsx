import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Shared Academic CV', robots: { index: false, follow: false } };
export default function ShareLayout({ children }: { children: React.ReactNode }) { return children; }
