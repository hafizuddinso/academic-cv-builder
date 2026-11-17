import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CVDocument from '@/components/CVDocument';
import type { CVData } from '@/lib/cv';
import PublicActions from '@/components/PublicActions';

export const dynamic = 'force-dynamic';
type Params = { params: Promise<{ slug: string }> };

async function findPublishedCV(slug: string): Promise<CVData | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const client = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await client
    .from('cv_profiles')
    .select('data')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error || !data) return null;
  return data.data as CVData;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const cv = await findPublishedCV(slug);
  if (!cv) return { title: 'Profile not found', robots: { index: false } };
  const name = cv.name || 'Academic Researcher';
  const description = (cv.headline || cv.affiliation || 'Academic CV and researcher portfolio').slice(0, 160);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return {
    title: `${name} — Academic CV`,
    description,
    ...(siteUrl ? { alternates: { canonical: `${siteUrl}/p/${slug}` } } : {}),
    openGraph: { title: `${name} — Academic CV`, description, type: 'profile' },
    robots: { index: true, follow: true },
  };
}

export default async function PublicProfile({ params }: Params) {
  const { slug } = await params;
  const cv = await findPublishedCV(slug);
  if (!cv) notFound();
  return <div className="public-wrap">
    <div className="public-toolbar">
      <a href="/" className="brand-mini">ACADEMIC CV <span>/ PUBLIC PROFILE</span></a>
      <PublicActions />
    </div>
    <div className="public-paper"><CVDocument cv={cv}/></div>
  </div>;
}
