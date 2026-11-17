import type { CVData, Entry } from '@/lib/cv';
import { safeExternalUrl } from '@/lib/cv';

function Details({ text, bullets = false }: { text: string; bullets?: boolean }) {
  const lines = text.split('\n').map(v => v.trim()).filter(Boolean);
  if (!lines.length) return null;
  return bullets
    ? <ul className="cv-bullets">{lines.map((line, i) => <li key={i}>{line.replace(/^[•\-]\s*/, '')}</li>)}</ul>
    : <div className="cv-notes">{lines.map((line, i) => <p key={i}>{line.replace(/^[•\-]\s*/, '')}</p>)}</div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="cv-section"><h2>{title}</h2>{children}</section>;
}
function EntryList({ entries, bullets }: { entries: Entry[]; bullets?: boolean }) {
  return <div className="cv-stack">{entries.map(entry => <div key={entry.id} className="cv-entry">
    <div className="cv-entry-head"><strong>{entry.title}</strong><span>{entry.period}</span></div>
    <div className="cv-entry-sub"><span>{entry.organization}</span><span>{entry.location}</span></div>
    <Details text={entry.details} bullets={bullets}/>
  </div>)}</div>;
}
export default function CVDocument({ cv }: { cv: CVData }) {
  const external = [
    ['LinkedIn', cv.linkedin], ['GitHub', cv.github], ['ORCID', cv.orcid], ['Portfolio', cv.website]
  ].filter(([, url]) => safeExternalUrl(url));
  return <article className="cv-page" id="cv-print">
    <header className="cv-header">
      <h1>{cv.name || 'Your name'}</h1>
      <div className="cv-headline">{cv.headline}</div>
      <div className="cv-affiliation">{cv.affiliation}</div>
      <div className="cv-contact">
        {cv.location && <span>{cv.location}</span>}
        {cv.email && <a href={`mailto:${cv.email}`}>{cv.email}</a>}
        {cv.showPhone && cv.phone && <span>{cv.phone}</span>}
        {external.map(([label, url]) => <a key={label} href={safeExternalUrl(url)!} target="_blank" rel="noopener noreferrer">{label}</a>)}
      </div>
    </header>
    {cv.summary && <Section title="Research Profile"><p>{cv.summary}</p></Section>}
    {cv.interests && <Section title="Research Interests"><p>{cv.interests}</p></Section>}
    {cv.education.length > 0 && <Section title="Education"><EntryList entries={cv.education}/></Section>}
    {cv.publications.length > 0 && <Section title="Publications & Research Papers"><div className="cv-stack">{cv.publications.map((p, i) => <div className="cv-pub" key={p.id}>
      <span className="cv-pub-num">[{i+1}]</span><div><strong>{p.authors}</strong>. “{p.title}.” <em>{p.venue}</em>, {p.year}. {p.details}{p.url && safeExternalUrl(p.url) && <> <a href={safeExternalUrl(p.url)!} target="_blank" rel="noopener noreferrer">DOI / Link</a></>}</div>
    </div>)}</div></Section>}
    {cv.research.length > 0 && <Section title="Research Experience"><EntryList entries={cv.research} bullets/></Section>}
    {cv.experience.length > 0 && <Section title="Professional Experience"><EntryList entries={cv.experience} bullets/></Section>}
    {cv.projects.length > 0 && <Section title="Selected Software Projects">{cv.projects.map(p => <div className="cv-entry" key={p.id}>
      <div className="cv-entry-head"><strong>{p.title}</strong><span>{p.year}</span></div>
      <p>{p.details}</p>{safeExternalUrl(p.url) && <a href={safeExternalUrl(p.url)!} target="_blank" rel="noopener noreferrer">Project repository</a>}
    </div>)}</Section>}
    {cv.skills.some(s => s.content) && <Section title="Technical Skills">{cv.skills.filter(s => s.content).map(s => <p className="cv-skill" key={s.label}><strong>{s.label}:</strong> {s.content}</p>)}</Section>}
    {cv.teaching && <Section title="Teaching & Training"><Details text={cv.teaching} bullets/></Section>}
    {cv.awards && <Section title="Awards & Recognition"><Details text={cv.awards} bullets/></Section>}
    {cv.certifications && <Section title="Certifications & Training"><Details text={cv.certifications} bullets/></Section>}
    {cv.languages && <Section title="Languages"><p>{cv.languages}</p></Section>}
    {cv.showReferences && cv.references && <Section title="References"><Details text={cv.references}/></Section>}
  </article>;
}
