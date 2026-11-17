'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Copy, Download, ExternalLink, FileText, LockKeyhole, LogOut, Plus, RefreshCw, Save, Sparkles, Trash2 } from 'lucide-react';
import CVDocument from '@/components/CVDocument';
import { CVData, Entry, Publication, Project, STEPS, starterCV, emptyEntry, emptyPublication, emptyProject, normalizeSlug } from '@/lib/cv';
import { getSupabase, supabaseConfigured } from '@/lib/supabase';

type AIChoice = { label: string; text: string };
type EntryKey = 'education' | 'research' | 'experience';

function Field({ label, value, onChange, placeholder, note }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; note?: string }) {
  return <label className="field"><span className="field-label">{label}</span><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''}/>{note && <small>{note}</small>}</label>;
}
function Area({ label, value, onChange, rows = 4, note }: { label: string; value: string; onChange: (v: string) => void; rows?: number; note?: string }) {
  return <label className="field"><span className="field-label">{label}</span><textarea value={value} rows={rows} onChange={e => onChange(e.target.value)}/>{note && <small>{note}</small>}</label>;
}
function SectionHeading({ number, title, description }: { number: string; title: string; description?: string }) {
  return <div className="group-heading"><div><span className="eyebrow">SECTION {number}</span><h3>{title}</h3>{description && <p>{description}</p>}</div></div>;
}
export default function Home() {
  const [cv, setCV] = useState<CVData>(starterCV);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [aiItem, setAiItem] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('Make this concise and suitable for a PhD scholarship application.');
  const [aiChoices, setAiChoices] = useState<AIChoice[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [published, setPublished] = useState(false);
  const [savedSlug, setSavedSlug] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const supabase = useMemo(() => getSupabase(), []);

  useEffect(() => {
    try {
      const local = localStorage.getItem('academic-cv-studio-v1');
      if (local) setCV({ ...starterCV, ...JSON.parse(local) });
    } catch { /* ignore invalid backups */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem('academic-cv-studio-v1', JSON.stringify(cv)); }, [cv, hydrated]);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, [supabase]);
  useEffect(() => {
    if (!supabase || !session?.user) return;
    let active = true;
    (async () => {
      const [draft, profile] = await Promise.all([
        supabase.from('cv_drafts').select('data').eq('user_id', session.user.id).maybeSingle(),
        supabase.from('cv_profiles').select('slug,published').eq('user_id', session.user.id).maybeSingle()
      ]);
      if (!active) return;
      if (draft.data?.data) setCV({ ...starterCV, ...(draft.data.data as CVData) });
      setPublished(!!profile.data?.published);
      setSavedSlug(profile.data?.slug || '');
    })();
    return () => { active = false; };
  }, [session?.user?.id, supabase]);

  const patch = <K extends keyof CVData>(key: K, value: CVData[K]) => setCV(prev => ({ ...prev, [key]: value }));
  const modifyEntry = (key: EntryKey, index: number, property: keyof Entry, value: string) =>
    setCV(prev => ({ ...prev, [key]: prev[key].map((v, i) => i === index ? { ...v, [property]: value } : v) }));
  const addEntry = (key: EntryKey) => setCV(prev => ({ ...prev, [key]: [...prev[key], emptyEntry()] }));
  const removeEntry = (key: EntryKey, index: number) => setCV(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  const modifyPub = (index: number, property: keyof Publication, value: string) =>
    setCV(prev => ({ ...prev, publications: prev.publications.map((v, i) => i === index ? { ...v, [property]: value } : v) }));
  const modifyProject = (index: number, property: keyof Project, value: string) =>
    setCV(prev => ({ ...prev, projects: prev.projects.map((v, i) => i === index ? { ...v, [property]: value } : v) }));

  const goTo = (s: number) => { setStep(s); setAiChoices([]); setAiError(''); setAiItem(0); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const currentAiTargets = step === 2 ? cv.education : step === 3 ? cv.research : step === 4 ? cv.experience : [];
  const target = step === 0 ? cv.headline : step === 1 ? cv.summary : step === 2 ? cv.education[aiItem]?.details : step === 3 ? cv.research[aiItem]?.details : step === 4 ? cv.experience[aiItem]?.details : step === 5 ? cv.skillsSummary : '';
  const setAiTarget = (text: string) => {
    if (step === 0) patch('headline', text);
    if (step === 1) patch('summary', text);
    if (step === 2 && cv.education[aiItem]) modifyEntry('education', aiItem, 'details', text);
    if (step === 3 && cv.research[aiItem]) modifyEntry('research', aiItem, 'details', text);
    if (step === 4 && cv.experience[aiItem]) modifyEntry('experience', aiItem, 'details', text);
    if (step === 5) patch('skillsSummary', text);
    setAiChoices([]);
  };
  const makeSuggestions = async () => {
    if (!target?.trim()) { setAiError('Add text to this section before generating variations.'); return; }
    setAiChoices([]); setAiError(''); setAiLoading(true);
    try {
      const token = session?.access_token;
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ section: STEPS[step].label, existing: target, prompt: aiPrompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not generate suggestions');
      setAiChoices(data.versions);
    } catch (e) { setAiError(e instanceof Error ? e.message : 'Could not generate suggestions'); }
    finally { setAiLoading(false); }
  };

  const signIn = async () => {
    if (!supabase) { setNotice('Connect Supabase first. See README.md.'); return; }
    if (!loginEmail.includes('@')) { setNotice('Enter a valid email address.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email: loginEmail.trim(), options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    setNotice(error ? error.message : 'Check your inbox for the Supabase sign-in link.');
  };
  const saveDraft = async () => {
    if (!supabase || !session?.user) { setLoginOpen(true); setNotice('Sign in with Supabase to save a cloud draft. This draft is already saved locally.'); return; }
    setBusy(true);
    const { error } = await supabase.from('cv_drafts').upsert({ user_id: session.user.id, data: cv }, { onConflict: 'user_id' });
    setBusy(false);
    setNotice(error ? error.message : 'Private draft saved to Supabase.');
  };
  const publish = async () => {
    if (!supabase || !session?.user) { setLoginOpen(true); setNotice('Sign in with Supabase before publishing your public CV.'); return; }
    const slug = normalizeSlug(cv.slug);
    if (!slug || slug.length < 3) { setNotice('Choose a public URL slug with at least 3 letters or numbers.'); goTo(0); return; }
    setBusy(true);
    // The PUBLIC table receives only the publication-ready snapshot, with optional fields redacted.
    const publicCV = { ...cv, phone: cv.showPhone ? cv.phone : '', references: cv.showReferences ? cv.references : '' };
    const { error: draftError } = await supabase.from('cv_drafts').upsert({ user_id: session.user.id, data: cv }, { onConflict: 'user_id' });
    const { error } = draftError ? { error: draftError } : await supabase.from('cv_profiles').upsert({ user_id: session.user.id, slug, data: publicCV, published: true }, { onConflict: 'user_id' });
    setBusy(false);
    if (error) { setNotice(error.message.includes('duplicate') ? 'This public URL is already taken. Try another slug.' : error.message); return; }
    setPublished(true); setSavedSlug(slug); setNotice('Published! Your public link is ready below.');
  };
  const unpublish = async () => {
    if (!supabase || !session?.user) return;
    setBusy(true);
    const { error } = await supabase.from('cv_profiles').update({ published: false }).eq('user_id', session.user.id);
    setBusy(false);
    if (error) setNotice(error.message); else { setPublished(false); setNotice('Public profile unpublished. Your private draft is unchanged.'); }
  };
  const publicLink = published && savedSlug && typeof window !== 'undefined' ? `${window.location.origin}/p/${savedSlug}` : '';
  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(cv, null, 2)], { type: 'application/json' });
    const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = 'academic-cv-backup.json'; a.click(); URL.revokeObjectURL(u);
  };

  function renderEntries(key: EntryKey, heading: string, description: string) {
    return <div className="field-group"><SectionHeading number={key === 'education' ? '01' : '01'} title={heading} description={description}/>
      {cv[key].map((entry, i) => <div key={entry.id} className="edit-card">
        <div className="edit-card-top"><span>{String(i + 1).padStart(2, '0')} / {entry.title || 'New entry'}</span><button className="icon-button" type="button" aria-label="Remove entry" onClick={() => removeEntry(key, i)}><Trash2 size={15}/></button></div>
        <div className="form-grid two"><Field label="Title / degree" value={entry.title} onChange={v => modifyEntry(key, i, 'title', v)}/><Field label="Institution / organization" value={entry.organization} onChange={v => modifyEntry(key, i, 'organization', v)}/></div>
        <div className="form-grid two"><Field label="Date / period" value={entry.period} onChange={v => modifyEntry(key, i, 'period', v)}/><Field label="Location" value={entry.location} onChange={v => modifyEntry(key, i, 'location', v)}/></div>
        <Area label="Thesis, achievements or bullet points" rows={4} value={entry.details} onChange={v => modifyEntry(key, i, 'details', v)} note="Use one line per point. The AI assistant below can rewrite this field."/>
      </div>)}
      <button type="button" className="btn btn-outline btn-add" onClick={() => addEntry(key)}><Plus size={15}/> Add {key === 'education' ? 'degree' : key === 'research' ? 'research project' : 'role'}</button>
    </div>;
  }

  function renderStep() {
    switch (step) {
      case 0: return <div className="fields-content"><SectionHeading number="01" title="About you" description="Your academic identity, exactly as you want it to appear on your CV and website."/>
        <div className="form-grid two"><Field label="Full name" value={cv.name} onChange={v => patch('name', v)}/><Field label="Location" value={cv.location} onChange={v => patch('location', v)}/></div>
        <Field label="Academic headline" value={cv.headline} onChange={v => patch('headline', v)}/>
        <Field label="Current position / affiliation" value={cv.affiliation} onChange={v => patch('affiliation', v)}/>
        <div className="form-grid two"><Field label="Email" value={cv.email} onChange={v => patch('email', v)}/><Field label="Phone (optional)" value={cv.phone} onChange={v => patch('phone', v)} note="Not included in the public CV unless you enable it."/></div>
        <div className="form-grid two"><Field label="LinkedIn URL" value={cv.linkedin} onChange={v => patch('linkedin', v)}/><Field label="GitHub URL" value={cv.github} onChange={v => patch('github', v)}/></div>
        <div className="form-grid two"><Field label="ORCID URL" value={cv.orcid} onChange={v => patch('orcid', v)}/><Field label="Personal website URL" value={cv.website} onChange={v => patch('website', v)}/></div>
        <label className="checkline"><input type="checkbox" checked={cv.showPhone} onChange={e => patch('showPhone', e.target.checked)}/> Show phone number in the PDF and public CV</label>
        <div className="divider-light"/>
        <SectionHeading number="02" title="Your shareable URL" description="This becomes your portfolio address once you publish with Supabase."/>
        <div className="slug-field"><span>{hydrated && typeof window !== 'undefined' ? window.location.host : 'your-domain.com'}/p/</span><input value={cv.slug} onChange={e => patch('slug', normalizeSlug(e.target.value))} aria-label="Public profile slug"/></div>
      </div>;
      case 1: return <div className="fields-content"><SectionHeading number="01" title="Research profile" description="A focused 4–6 sentence overview for admission and scholarship committees."/>
        <Area label="Academic summary" value={cv.summary} rows={9} onChange={v => patch('summary', v)}/>
        <Area label="Research interests" rows={4} value={cv.interests} onChange={v => patch('interests', v)} note="Use short keywords separated by commas."/></div>;
      case 2: return <div className="fields-content">{renderEntries('education', 'Academic qualifications', 'List your most recent degree first. Include thesis topics, grade and relevant funding.')}</div>;
      case 3: return <div className="fields-content">
        {renderEntries('research', 'Research experience', 'Show your methods, implementation and research results.')}
        <div className="field-group"><SectionHeading number="02" title="Publications" description="Keep citations accurate and add DOI links where available."/>
          {cv.publications.map((p, i) => <div key={p.id} className="edit-card"><div className="edit-card-top"><span>PUBLICATION {String(i + 1).padStart(2, '0')}</span><button type="button" className="icon-button" aria-label="Remove publication" onClick={() => patch('publications', cv.publications.filter((_, n) => n !== i))}><Trash2 size={15}/></button></div>
            <Field label="Paper title" value={p.title} onChange={v => modifyPub(i, 'title', v)}/><Field label="Authors" value={p.authors} onChange={v => modifyPub(i, 'authors', v)}/>
            <Field label="Conference / journal / proceedings" value={p.venue} onChange={v => modifyPub(i, 'venue', v)}/>
            <div className="form-grid two"><Field label="Year" value={p.year} onChange={v => modifyPub(i, 'year', v)}/><Field label="DOI or paper link" value={p.url} onChange={v => modifyPub(i, 'url', v)}/></div>
            <Area label="Publication notes" value={p.details} rows={2} onChange={v => modifyPub(i, 'details', v)}/>
          </div>)}
          <button type="button" className="btn btn-outline btn-add" onClick={() => patch('publications', [...cv.publications, emptyPublication()])}><Plus size={15}/> Add publication</button>
        </div>
      </div>;
      case 4: return <div className="fields-content">
        {renderEntries('experience', 'Professional experience', 'Focus on responsibilities and measurable contributions without exaggeration.')}
        <div className="field-group"><SectionHeading number="02" title="Selected projects" description="Highlight research-relevant technical work and GitHub projects."/>
          {cv.projects.map((p, i) => <div className="edit-card" key={p.id}><div className="edit-card-top"><span>PROJECT {String(i + 1).padStart(2, '0')}</span><button type="button" className="icon-button" aria-label="Remove project" onClick={() => patch('projects', cv.projects.filter((_, n) => n !== i))}><Trash2 size={15}/></button></div>
            <div className="form-grid two"><Field label="Project name" value={p.title} onChange={v => modifyProject(i, 'title', v)}/><Field label="Year" value={p.year} onChange={v => modifyProject(i, 'year', v)}/></div>
            <Area label="Overview and contributions" value={p.details} onChange={v => modifyProject(i, 'details', v)}/><Field label="Project URL" value={p.url} onChange={v => modifyProject(i, 'url', v)}/>
          </div>)}
          <button type="button" className="btn btn-outline btn-add" onClick={() => patch('projects', [...cv.projects, emptyProject()])}><Plus size={15}/> Add project</button>
        </div>
      </div>;
      case 5: return <div className="fields-content"><SectionHeading number="01" title="Technical expertise" description="Group skills by area; your CV will keep the categories easy to scan."/>
        <Area label="Skills overview (for optional AI rewriting)" rows={3} value={cv.skillsSummary} onChange={v => patch('skillsSummary', v)} note="This is an editing aid; the CV lists the categories below."/>
        {cv.skills.map((s, i) => <div className="form-grid skill-grid" key={i}><Field label="Category" value={s.label} onChange={v => patch('skills', cv.skills.map((v2, n) => n === i ? { ...v2, label: v } : v2))}/><Field label="Skills (comma separated)" value={s.content} onChange={v => patch('skills', cv.skills.map((v2, n) => n === i ? { ...v2, content: v } : v2))}/><button type="button" className="icon-button skill-delete" aria-label="Remove skill category" onClick={() => patch('skills', cv.skills.filter((_, n) => n !== i))}><Trash2 size={15}/></button></div>)}
        <button type="button" className="btn btn-outline btn-add" onClick={() => patch('skills', [...cv.skills, { label: '', content: '' }])}><Plus size={15}/> Add skills category</button>
        <div className="divider-light"/><SectionHeading number="02" title="Additional information"/>
        <Area label="Teaching & training experience" value={cv.teaching} onChange={v => patch('teaching', v)}/>
        <Area label="Awards & scholarships" value={cv.awards} onChange={v => patch('awards', v)}/>
        <Area label="Certifications" value={cv.certifications} onChange={v => patch('certifications', v)}/>
        <Field label="Languages" value={cv.languages} onChange={v => patch('languages', v)}/>
        <Area label="References (optional/private by default)" value={cv.references} onChange={v => patch('references', v)} rows={3}/>
        <label className="checkline"><input type="checkbox" checked={cv.showReferences} onChange={e => patch('showReferences', e.target.checked)}/> Include references in the PDF and published profile</label>
      </div>;
      default: return null;
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="sidebar-brand" href="/"><div className="brand-symbol">A<span>.</span></div><div><strong>ACADEMIC CV</strong><small>STUDIO / BUILDER</small></div></a>
      <div className="sidebar-label">BUILD YOUR DOCUMENT</div>
      <nav aria-label="CV steps" className="step-nav">{STEPS.map((s, i) => <button key={s.short} type="button" onClick={() => goTo(i)} className={`step-link ${step === i ? 'active' : ''}`}>
        <span className="step-number">{String(i + 1).padStart(2, '0')}</span><span>{s.short}</span>{step > i ? <Check size={14} className="nav-check"/> : step === i ? <ChevronRight size={15} className="nav-check"/> : null}
      </button>)}</nav>
      <div className="sidebar-separator"/>
      <button type="button" className={`step-link final-link ${step === 6 ? 'active' : ''}`} onClick={() => goTo(6)}><FileText size={17}/><span>Final preview</span><ChevronRight size={15} className="nav-check"/></button>
      <div className="sidebar-bottom"><div className="side-progress"><div><span>YOUR PROGRESS</span><strong>{step === 6 ? 'Complete' : `${step + 1} of 6`}</strong></div><div className="progress-track"><div style={{ width: `${Math.min(step + 1, 6)/6*100}%` }}/></div></div>
      <div className="side-note"><LockKeyhole size={15}/><span>Saved automatically in this browser. Your profile stays private until you publish.</span></div></div>
    </aside>

    <div className="workspace">
      <header className="topbar"><div className="breadcrumb">APPLICATION / <b>{step === 6 ? 'FINAL PREVIEW' : STEPS[step].short.toUpperCase()}</b></div>
        <div className="top-actions"><span className="save-state"><CheckCircle2 size={14}/> Local autosave</span>
          <button className="btn btn-quiet auth-trigger" type="button" onClick={() => setLoginOpen(v => !v)}>{session?.user ? 'Account' : 'Sign in'} <ExternalLink size={13}/></button>
          <button type="button" className="btn btn-primary btn-top" onClick={() => goTo(6)}>Preview CV <ArrowRight size={15}/></button></div></header>
      {loginOpen && <div className="login-panel"><div><strong>Cloud account</strong><p>{supabaseConfigured ? 'Use a Supabase magic link to save and publish.' : 'Demo mode: add Supabase environment variables to activate accounts and public links.'}</p></div>
        {session?.user ? <div className="login-row"><span>{session.user.email}</span><button type="button" className="btn btn-outline" onClick={async () => { await supabase?.auth.signOut(); setLoginOpen(false); setPublished(false); setSavedSlug(''); }}> <LogOut size={14}/> Sign out</button></div> : <div className="login-row"><input type="email" value={loginEmail} placeholder="you@university.edu" onChange={e => setLoginEmail(e.target.value)}/><button disabled={!supabaseConfigured || busy} type="button" className="btn btn-primary" onClick={signIn}>Email sign-in link</button></div>}
      </div>}
      {notice && <div className="notice" role="status"><span>{notice}</span><button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}

      {step !== 6 ? <div className="editor-layout">
        <main className="editor-main"><div className="editor-intro"><div className="eyebrow">STEP {String(step + 1).padStart(2, '0')} / 06</div><h1>{STEPS[step].label}</h1><p>{STEPS[step].hint}</p></div>
          {renderStep()}
          <div className="ai-box"><div className="ai-top"><div className="ai-symbol"><Sparkles size={18}/></div><div><h3>Writing assistant</h3><p>Generate three accurate wording options. Review before applying.</p></div><span className="ai-tag">OPTIONAL AI</span></div>
            {currentAiTargets.length > 1 && <label className="field ai-target"><span className="field-label">Rewrite which entry?</span><select value={Math.min(aiItem,currentAiTargets.length-1)} onChange={e => { setAiItem(Number(e.target.value)); setAiChoices([]); }}>{currentAiTargets.map((item, i) => <option value={i} key={item.id}>{item.title || `Entry ${i + 1}`}</option>)}</select></label>}
            <label className="field"><span className="field-label">A small instruction for your rewrite</span><input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g. Formal European PhD application, 80 words"/></label>
            <div className="ai-actions"><button type="button" className="btn btn-dark" disabled={aiLoading || !target} onClick={makeSuggestions}>{aiLoading ? <RefreshCw size={15} className="spin"/> : <Sparkles size={15}/>} {aiLoading ? 'Generating...' : 'Generate 3 versions'}</button><small>Requires an authorized sign-in and server AI key.</small></div>
            {aiError && <p className="error-text">{aiError}</p>}
            {aiChoices.length > 0 && <div className="ai-choices">{aiChoices.map(choice => <div className="ai-choice" key={choice.label}><strong>{choice.label}</strong><p>{choice.text}</p><button type="button" className="btn btn-outline" onClick={() => setAiTarget(choice.text)}>Use this version <ArrowRight size={13}/></button></div>)}</div>}
          </div>
          <div className="editor-footer"><button type="button" className="btn btn-quiet" disabled={step === 0} onClick={() => goTo(step - 1)}><ArrowLeft size={15}/> Previous</button><button type="button" className="btn btn-primary" onClick={() => goTo(step + 1)}>{step === 5 ? 'Review final CV' : 'Save & continue'} <ArrowRight size={15}/></button></div>
        </main>
        <aside className="preview-panel"><div className="preview-bar"><span><span className="preview-dot"/> LIVE DOCUMENT PREVIEW</span><button type="button" onClick={() => goTo(6)}>Full view <ExternalLink size={13}/></button></div><div className="preview-scroll"><div className="preview-scale"><CVDocument cv={cv}/></div></div></aside>
      </div> : <main className="review-page"><div className="review-header"><div><span className="eyebrow">ALL SECTIONS COMPLETE</span><h1>Your academic CV.</h1><p>Review the formatted document, save as PDF, or publish a shareable profile.</p></div><div className="review-actions"><button className="btn btn-outline" type="button" onClick={exportBackup}><Save size={15}/> Export backup</button><button className="btn btn-primary" type="button" onClick={() => window.print()}><Download size={15}/> Save as PDF</button></div></div>
        <div className="publish-panel"><div><strong>{published ? 'Your portfolio is live' : 'Ready to share your profile?'}</strong><p>{published ? 'This is the last published snapshot. Click Publish changes after further edits.' : 'Sign in to Supabase, then publish a public version at /p/your-name.'}</p>{publicLink && <div className="public-link"><a href={publicLink} target="_blank" rel="noreferrer">{publicLink}</a><button type="button" onClick={() => { navigator.clipboard.writeText(publicLink); setNotice('Public link copied.'); }} aria-label="Copy public link"><Copy size={15}/></button></div>}</div><div className="publish-actions"><button disabled={busy} className="btn btn-outline" type="button" onClick={saveDraft}><Save size={15}/> Save draft</button><button disabled={busy} className="btn btn-dark" type="button" onClick={publish}>{published ? 'Publish changes' : 'Publish portfolio'} <ArrowRight size={15}/></button>{published && <button disabled={busy} className="btn btn-text" type="button" onClick={unpublish}>Unpublish</button>}</div></div>
        <div className="review-paper"><CVDocument cv={cv}/></div>
        <p className="print-tip"><Download size={14}/> The PDF button opens your browser’s print dialog. Choose “Save as PDF” for a clean A4 document.</p>
      </main>}
    </div>
  </div>;
}
