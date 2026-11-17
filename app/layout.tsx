import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Academic CV Studio | Free PhD & Scholarship CV Builder', template: '%s | Academic CV Studio' },
  description: 'Free, privacy-first academic CV and portfolio builder for PhD students, researchers and scholarship applicants. Six steps, offline writing ideas, PDF export and shareable links. No sign-in or database.',
  keywords: [ 'academic CV', 'PhD resume', 'scholarship CV', 'researcher portfolio', 'resume builder', 'academic resume', 'free CV builder', 'no login', 'Next.js' ],
  applicationName: 'Academic CV Studio',
  openGraph: {
    type: 'website', siteName: 'Academic CV Studio', title: 'Academic CV Studio — Free Academic CV Builder',
    description: 'Create a professional academic CV in six steps. No accounts, no database, no cost.'
  }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
