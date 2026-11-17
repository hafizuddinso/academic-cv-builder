import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Academic CV Builder', template: '%s | Academic CV Builder' },
  description: 'A simple academic CV editor for PhD, scholarship and research applications. Edit, print and share your CV in the browser.',
  applicationName: 'Academic CV Builder',
  keywords: ['academic CV', 'PhD CV', 'scholarship CV', 'research CV', 'resume builder'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
