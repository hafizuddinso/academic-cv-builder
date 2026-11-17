'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Copy, Download, ExternalLink, FileText, LockKeyhole, Plus, Save, Pencil, Trash2, RotateCcw } from 'lucide-react';
import CVDocument from '@/components/CVDocument';
import { CVData, Entry, Publication, Project, STEPS, starterCV, emptyEntry, emptyPublication, emptyProject } from '@/lib/cv';
import { createShareUrl } from '@/lib/share';

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
  const [aiChoices, setAiChoices] = useState<AIChoice[]>([]);
  const [aiError, setAiError] = useState('');
  const [notice, setNotice] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    try {
      const local = localStorage.getItem('academic-cv-builder-draft-v3') ?? localStorage.getItem('academic-cv-studio-v2');
      if (local) {
        const data = JSON.parse(local);
        if (data && typeof data.name === 'string' && Array.isArray(data.education)) setCV({ ...starterCV, ...data });
      }
    } catch { /* ignore damaged local data */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem('academic-cv-builder-draft-v3', JSON.stringify(cv));
  }, [cv, hydrated]);

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
  // Entirely local word-formatting ideas: no API, account or claims of AI generation.
  const makeSuggestions = () => {
    if (!target?.trim()) { setAiError('Write something in this section first.'); return; }
    setAiError('');
    const cleaned = target.replace(/[ \t]+/g, ' ').trim();
    const lines = cleaned.split(/\n+/).filter(Boolean);
    const sentences = cleaned.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean);
    const shorter = sentences.slice(0, Math.min(2, sentences.length)).join(' ');
    const formal = cleaned.replace(/\bI worked on\b/gi, 'Contributed to').replace(/\bI helped\b/gi, 'Supported').replace(/\ba lot of\b/gi, 'multiple');
    const structured = lines.length > 1 ? lines.map(line => `• ${line.replace(/^[•\-]\s*/, '')}`).join('\n') : sentences.map(line => `• ${line}`).join('\n');
    setAiChoices([
      { label: 'Concise', text: shorter || cleaned },
      { label: 'Academic wording', text: formal },
      { label: 'Structured points', text: structured }
    ]);
  };
  const createLink = async () => {
    setSharing(true);
    try {
      const url = await createShareUrl(cv);
      setShareLink(url);
      try { await navigator.clipboard.writeText(url); setNotice('Share link copied. Anyone with the link can read the included CV details.'); }
      catch { setNotice('Link generated below. Copy it manually to share.'); }
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Could not create the share link.'); }
    finally { setSharing(false); }
  };
  const resetExample = () => {
    if (!window.confirm('Replace your current browser draft with the fictional example? Export a backup first if needed.')) return;
    setCV(starterCV);
    setShareLink('');
    setNotice('Example restored. Your current draft has been replaced in this browser.');
    goTo(0);
  };
  const importBackup = async (file?: File) => {
    if (!file) return;
    if (file.size > 1024 * 1024) { setNotice('JSON backup is too large (maximum 1 MB).'); return; }
    try {
      const data: unknown = JSON.parse(await file.text());
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid JSON backup.');
      const c = data as Partial<CVData>;
      if (typeof c.name !== 'string' || typeof c.summary !== 'string' || !Array.isArray(c.education)) throw new Error('Not a valid academic CV backup.');
      setCV({ ...starterCV, ...c });
      setShareLink('');
      setNotice('Backup imported and saved in this browser.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Unable to import the backup.'); }
  };
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
        <Area label="Thesis, achievements or bullet points" rows={4} value={entry.details} onChange={v => modifyEntry(key, i, 'details', v)} note="Use one line per point. The writing ideas below can reformat this field."/>
      </div>)}
      <button type="button" className="btn btn-outline btn-add" onClick={() => addEntry(key)}><Plus size={15}/> Add {key === 'education' ? 'degree' : key === 'research' ? 'research project' : 'role'}</button>
    </div>;
  }

  function renderStep() {
    switch (step) {
      case 0: return <div className="fields-content"><SectionHeading number="01" title="About you" description="Choose what you want to show on your CV."/>
        <div className="form-grid two"><Field label="Full name" value={cv.name} onChange={v => patch('name', v)}/><Field label="Location" value={cv.location} onChange={v => patch('location', v)}/></div>
        <Field label="Academic headline" value={cv.headline} onChange={v => patch('headline', v)}/>
        <Field label="Current position / affiliation" value={cv.affiliation} onChange={v => patch('affiliation', v)}/>
        <div className="form-grid two"><Field label="Email" value={cv.email} onChange={v => patch('email', v)}/><Field label="Phone (optional)" value={cv.phone} onChange={v => patch('phone', v)} note="Only visible in PDF or shared links if you enable it."/></div>
        <div className="form-grid two"><Field label="LinkedIn URL" value={cv.linkedin} onChange={v => patch('linkedin', v)}/><Field label="GitHub URL" value={cv.github} onChange={v => patch('github', v)}/></div>
        <div className="form-grid two"><Field label="ORCID URL" value={cv.orcid} onChange={v => patch('orcid', v)}/><Field label="Personal website URL" value={cv.website} onChange={v => patch('website', v)}/></div>
        <label className="checkline"><input type="checkbox" checked={cv.showPhone} onChange={e => patch('showPhone', e.target.checked)}/> Include phone number in PDF and shared links</label>
        <p className="field-help">The share link will include these details. Only add information you want to share.</p>
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
        <Area label="Skills overview (for optional writing suggestions)" rows={3} value={cv.skillsSummary} onChange={v => patch('skillsSummary', v)} note="This is an editing aid; the CV lists the categories below."/>
        {cv.skills.map((s, i) => <div className="form-grid skill-grid" key={i}><Field label="Category" value={s.label} onChange={v => patch('skills', cv.skills.map((v2, n) => n === i ? { ...v2, label: v } : v2))}/><Field label="Skills (comma separated)" value={s.content} onChange={v => patch('skills', cv.skills.map((v2, n) => n === i ? { ...v2, content: v } : v2))}/><button type="button" className="icon-button skill-delete" aria-label="Remove skill category" onClick={() => patch('skills', cv.skills.filter((_, n) => n !== i))}><Trash2 size={15}/></button></div>)}
        <button type="button" className="btn btn-outline btn-add" onClick={() => patch('skills', [...cv.skills, { label: '', content: '' }])}><Plus size={15}/> Add skills category</button>
        <div className="divider-light"/><SectionHeading number="02" title="Additional information"/>
        <Area label="Teaching & training experience" value={cv.teaching} onChange={v => patch('teaching', v)}/>
        <Area label="Awards & scholarships" value={cv.awards} onChange={v => patch('awards', v)}/>
        <Area label="Certifications" value={cv.certifications} onChange={v => patch('certifications', v)}/>
        <Field label="Languages" value={cv.languages} onChange={v => patch('languages', v)}/>
        <Area label="References (optional/private by default)" value={cv.references} onChange={v => patch('references', v)} rows={3}/>
        <label className="checkline"><input type="checkbox" checked={cv.showReferences} onChange={e => patch('showReferences', e.target.checked)}/> Include references in PDF and shared links</label>
      </div>;
      default: return null;
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="sidebar-brand" href="/"><div className="brand-symbol">A<span>.</span></div><div><strong>ACADEMIC CV</strong><small>CV BUILDER</small></div></a>
      <div className="sidebar-label">CV SECTIONS</div>
      <nav aria-label="CV steps" className="step-nav">{STEPS.map((s, i) => <button key={s.short} type="button" onClick={() => goTo(i)} className={`step-link ${step === i ? 'active' : ''}`}>
        <span className="step-number">{String(i + 1).padStart(2, '0')}</span><span>{s.short}</span>{step > i ? <Check size={14} className="nav-check"/> : step === i ? <ChevronRight size={15} className="nav-check"/> : null}
      </button>)}</nav>
      <div className="sidebar-separator"/>
      <button type="button" className={`step-link final-link ${step === 6 ? 'active' : ''}`} onClick={() => goTo(6)}><FileText size={17}/><span>Final preview</span><ChevronRight size={15} className="nav-check"/></button>
      <div className="sidebar-bottom"><div className="side-progress"><div><span>PROGRESS</span><strong>{step === 6 ? 'Complete' : `${step + 1} of 6`}</strong></div><div className="progress-track"><div style={{ width: `${Math.min(step + 1, 6)/6*100}%` }}/></div></div>
      <div className="side-note"><LockKeyhole size={15}/><span>Saved in this browser</span></div></div>
    </aside>

    <div className="workspace">
      <header className="topbar"><div className="breadcrumb">EDIT CV / <b>{step === 6 ? 'FINAL PREVIEW' : STEPS[step].short.toUpperCase()}</b></div>
        <div className="top-actions"><span className="save-state"><CheckCircle2 size={14}/> Saved locally</span>
          <button className="btn btn-quiet auth-trigger" type="button" onClick={resetExample}><RotateCcw size={13}/> Start over</button>
          <button type="button" className="btn btn-primary btn-top" onClick={() => goTo(6)}>Preview CV <ArrowRight size={15}/></button></div></header>
      {notice && <div className="notice" role="status"><span>{notice}</span><button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}

      {step !== 6 ? <div className="editor-layout">
        <main className="editor-main"><div className="editor-intro"><div className="eyebrow">STEP {String(step + 1).padStart(2, '0')} / 06</div><h1>{STEPS[step].label}</h1><p>{STEPS[step].hint}</p></div>
          {renderStep()}
          <div className="ai-box"><div className="ai-top"><div className="ai-symbol"><Pencil size={18}/></div><div><h3>Writing ideas</h3><p>Shorten or reformat what you wrote. These suggestions use simple text rules.</p></div></div>
            {currentAiTargets.length > 1 && <label className="field ai-target"><span className="field-label">Rewrite which entry?</span><select value={Math.min(aiItem,currentAiTargets.length-1)} onChange={e => { setAiItem(Number(e.target.value)); setAiChoices([]); }}>{currentAiTargets.map((item, i) => <option value={i} key={item.id}>{item.title || `Entry ${i + 1}`}</option>)}</select></label>}
            <div className="ai-actions"><button type="button" className="btn btn-dark" disabled={!target} onClick={makeSuggestions}><Pencil size={15}/> Suggest wording</button></div>
            {aiError && <p className="error-text">{aiError}</p>}
            {aiChoices.length > 0 && <div className="ai-choices">{aiChoices.map(choice => <div className="ai-choice" key={choice.label}><strong>{choice.label}</strong><p>{choice.text}</p><button type="button" className="btn btn-outline" onClick={() => setAiTarget(choice.text)}>Use this version <ArrowRight size={13}/></button></div>)}</div>}
          </div>
          <div className="editor-footer"><button type="button" className="btn btn-quiet" disabled={step === 0} onClick={() => goTo(step - 1)}><ArrowLeft size={15}/> Previous</button><button type="button" className="btn btn-primary" onClick={() => goTo(step + 1)}>{step === 5 ? 'Review CV' : 'Continue'} <ArrowRight size={15}/></button></div>
        </main>
        <aside className="preview-panel"><div className="preview-bar"><span><span className="preview-dot"/> CV PREVIEW</span><button type="button" onClick={() => goTo(6)}>Full view <ExternalLink size={13}/></button></div><div className="preview-scroll"><div className="preview-scale"><CVDocument cv={cv}/></div></div></aside>
      </div> : <main className="review-page"><div className="review-header"><div><span className="eyebrow">FINAL PREVIEW</span><h1>Review your CV</h1><p>Check the layout, save a PDF, or make a link to share.</p></div><div className="review-actions"><button className="btn btn-outline" type="button" onClick={exportBackup}><Save size={15}/> Export backup</button><button className="btn btn-primary" type="button" onClick={() => window.print()}><Download size={15}/> Save as PDF</button></div></div>
        <div className="publish-panel"><div><strong>Share this CV</strong><p>The link includes a copy of this CV. Anyone with the link can read it. If you make changes later, create a new link.</p>
          {shareLink && <div className="share-link-wrap"><label htmlFor="share-link-input">Your link</label><input id="share-link-input" aria-label="Shareable CV link" readOnly value={shareLink} onFocus={e => e.target.select()}/><a href={shareLink} target="_blank" rel="noreferrer">Open shared view <ExternalLink size={13}/></a></div>}
        </div><div className="publish-actions">
          <label className="btn btn-outline import-button">Import JSON <input type="file" accept=".json,application/json" hidden onChange={e => { importBackup(e.target.files?.[0]); e.target.value = ''; }}/></label>
          <button className="btn btn-dark" type="button" onClick={createLink} disabled={sharing}><Copy size={15}/> {sharing ? 'Creating…' : 'Create share link'}</button>
        </div></div>
        <div className="review-paper"><CVDocument cv={cv}/></div>
        <p className="print-tip"><Download size={14}/> When the print window opens, choose “Save as PDF”.</p>
      </main>}
    </div>
  </div>;
}
