export type Entry = { id: string; title: string; organization: string; location: string; period: string; details: string };
export type Publication = { id: string; title: string; authors: string; venue: string; year: string; details: string; url: string };
export type Project = { id: string; title: string; year: string; details: string; url: string };

export type CVData = {
  name: string; headline: string; affiliation: string; email: string; phone: string; location: string;
  linkedin: string; github: string; orcid: string; website: string;
  showPhone: boolean; showReferences: boolean;
  summary: string; interests: string;
  education: Entry[]; research: Entry[]; publications: Publication[];
  experience: Entry[]; projects: Project[];
  skillsSummary: string;
  skills: { label: string; content: string }[];
  teaching: string; awards: string; certifications: string; languages: string; references: string;
};

export const STEPS = [
  { short: 'Identity', label: 'Personal details', hint: 'Your academic identity, links and contact information.' },
  { short: 'Profile', label: 'Research profile', hint: 'An academic summary and focused research interests.' },
  { short: 'Education', label: 'Education', hint: 'Degrees, thesis topics and academic achievements.' },
  { short: 'Research', label: 'Research & papers', hint: 'Research projects and scholarly publications.' },
  { short: 'Experience', label: 'Experience & projects', hint: 'Professional work and selected technical projects.' },
  { short: 'Additional', label: 'Skills & awards', hint: 'Technical expertise, teaching, awards and more.' }
] as const;

/** Entirely fictional example data. No real applicant's personal data is bundled. */
export const starterCV: CVData = {
  name: 'Alex Example',
  headline: 'PhD Researcher · Sustainable Computing & Data Systems',
  affiliation: 'Doctoral Researcher · Example University',
  email: 'researcher@example.com',
  phone: '',
  location: 'Example City, Country',
  linkedin: '',
  github: 'https://github.com/example',
  orcid: '',
  website: '',
  showPhone: false,
  showReferences: false,
  summary: 'Doctoral researcher interested in sustainable computing and responsible data systems. My work explores practical ways to improve system performance while reducing resource use. I combine experimental methods, software prototyping, and clear technical communication. I am interested in interdisciplinary collaboration and research that can be independently reproduced.',
  interests: 'Sustainable Computing, Data Systems, Performance Evaluation, Reproducible Research, Open Science',
  education: [
    { id: 'edu1', title: 'PhD in Computer Science', organization: 'Example University', location: 'Example City, Country', period: '2024 – Present', details: 'Research area: Efficient and sustainable data processing.\nFocus: Experimental evaluation, performance analysis and reproducible methods.' },
    { id: 'edu2', title: 'MSc in Computing', organization: 'Sample Institute of Technology', location: 'Example City, Country', period: '2022 – 2024', details: 'Thesis: Evaluating resource-aware computing methods.\nCoursework: Data systems, research methods and software engineering.' },
    { id: 'edu3', title: 'BSc in Computer Science', organization: 'Sample College', location: 'Example City, Country', period: '2018 – 2022', details: 'Project: A prototype dashboard for monitoring system performance.' }
  ],
  research: [
    { id: 'research1', title: 'Resource-Aware Data Processing', organization: 'Example University', location: 'Example City, Country', period: '2024 – Present', details: 'Designed an experimental plan comparing three example processing approaches.\nBuilt a prototype workflow and documented reproducible evaluation steps.\nSummarized trade-offs in runtime and resource use.' }
  ],
  publications: [
    { id: 'pub1', title: 'An Illustrative Study of Efficient Data Workflows', authors: 'A. Example and B. Sample', venue: 'Example Conference Proceedings (fictional sample citation)', year: '2025', details: 'Fictional example — replace with a genuine publication or remove this entry.', url: '' }
  ],
  experience: [
    { id: 'work1', title: 'Research Assistant', organization: 'Example Research Lab', location: 'Example City, Country', period: '2023 – 2024', details: 'Supported literature reviews and experimental data collection.\nDeveloped small research tools and documented results for colleagues.' }
  ],
  projects: [
    { id: 'project1', title: 'Open Research Dashboard', year: '2024', details: 'Fictional sample project: a lightweight dashboard for presenting reproducible performance results.', url: '' }
  ],
  skillsSummary: 'Research skills in experimental design, data analysis and software development.',
  skills: [
    { label: 'Programming', content: 'Python, JavaScript, SQL' },
    { label: 'Research', content: 'Literature review, experimental design, reproducibility, academic writing' },
    { label: 'Tools', content: 'Git, Linux, LaTeX, data visualization' }
  ],
  teaching: 'Teaching assistant for an introductory computing course (fictional example).',
  awards: 'Example Research Scholarship (fictional example; replace or delete).',
  certifications: 'Example Professional Development Workshop (fictional example).',
  languages: 'English: Fluent · Additional language: Intermediate',
  references: ''
};

export const emptyEntry = (): Entry => ({ id: `e${Date.now()}${Math.random().toString(36).slice(2, 5)}`, title: '', organization: '', location: '', period: '', details: '' });
export const emptyPublication = (): Publication => ({ id: `p${Date.now()}${Math.random().toString(36).slice(2,5)}`, title: '', authors: '', venue: '', year: '', details: '', url: '' });
export const emptyProject = (): Project => ({ id: `pr${Date.now()}${Math.random().toString(36).slice(2,5)}`, title: '', year: '', details: '', url: '' });
export function safeExternalUrl(input: string): string | null {
  if (!input) return null;
  try { const url = new URL(input); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
