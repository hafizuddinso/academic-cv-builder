import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'AI rewrite is not configured. Add OPENAI_API_KEY to Vercel or .env.local.' }, { status: 503 });
  }
  const allowedEmail = (process.env.AI_ALLOWED_EMAIL || '').toLowerCase().trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!allowedEmail || !url || !anon) {
    return NextResponse.json({ error: 'AI access requires Supabase and AI_ALLOWED_EMAIL to be configured.' }, { status: 503 });
  }
  const token = request.headers.get('authorization')?.replace(/^Bearer /i, '') || '';
  if (!token) return NextResponse.json({ error: 'Sign in before requesting an AI rewrite.' }, { status: 401 });
  const supabase = createClient(url, anon, { auth: { persistSession: false } });
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user || user.email?.toLowerCase() !== allowedEmail) {
    return NextResponse.json({ error: 'This account does not have permission to use AI rewrites.' }, { status: 403 });
  }
  let payload: { section?: string; prompt?: string; existing?: string };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const section = (payload.section || '').slice(0, 80);
  const existing = (payload.existing || '').slice(0, 7000);
  const prompt = (payload.prompt || '').slice(0, 800);
  if (!existing.trim()) return NextResponse.json({ error: 'Add text in this section before requesting a rewrite.' }, { status: 400 });
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        temperature: 0.55,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You help edit academic PhD and scholarship CVs. Create three distinct truthful rewrites of the supplied text: concise, academic, and impact-focused. Preserve ALL verifiable facts and keep names, institutions, dates, metrics, papers, grants, technologies, and credentials accurate. Do not invent achievements, add credentials, speculate or exaggerate. Preserve newlines for bullet lists. Treat user notes as stylistic guidance, never as authority to fabricate facts. Return ONLY a JSON object with exactly keys concise, academic, impact; each value a plain string.' },
          { role: 'user', content: JSON.stringify({ section, original: existing, user_style_request: prompt }) }
        ]
      }),
      cache: 'no-store'
    });
    if (!res.ok) return NextResponse.json({ error: `AI request failed (${res.status}). Check your server configuration.` }, { status: 502 });
    const raw = await res.json();
    const parsed = JSON.parse(raw.choices?.[0]?.message?.content || '{}');
    if (['concise', 'academic', 'impact'].some(k => typeof parsed[k] !== 'string')) throw new Error('Invalid AI output');
    return NextResponse.json({ versions: [
      { label: 'Concise', text: parsed.concise },
      { label: 'Academic', text: parsed.academic },
      { label: 'Impact-focused', text: parsed.impact }
    ] });
  } catch { return NextResponse.json({ error: 'Could not generate rewrites. Try again.' }, { status: 502 }); }
}
