import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: 'Academic CV Studio | PhD & Scholarship CV Builder',
    template: '%s | Academic CV Studio',
  },
  description:
    'Open-source academic CV and portfolio builder for PhD students, researchers and scholarship applicants. Six guided steps, PDF export, optional AI writing assistant and shareable public profiles.',
  keywords: [
    'academic CV', 'PhD resume', 'scholarship CV', 'researcher portfolio',
    'resume builder', 'PhD application', 'academic resume', 'Supabase', 'Next.js',
  ],
  applicationName: 'Academic CV Studio',
  openGraph: {
    type: 'website',
    siteName: 'Academic CV Studio',
    title: 'Academic CV Studio — Academic CV & Portfolio Builder',
    description: 'Create an academic CV in six steps. Export a clean PDF and optionally publish a shareable researcher profile.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
