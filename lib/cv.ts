export type Entry = { id: string; title: string; organization: string; location: string; period: string; details: string };
export type Publication = { id: string; title: string; authors: string; venue: string; year: string; details: string; url: string };
export type Project = { id: string; title: string; year: string; details: string; url: string };

export type CVData = {
  name: string; headline: string; affiliation: string; email: string; phone: string; location: string;
  linkedin: string; github: string; orcid: string; website: string; slug: string;
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

export const starterCV: CVData = {
  name: 'Hafizuddin',
  headline: 'Cybersecurity & Network Systems Researcher · Applied Cryptography · IoT',
  affiliation: 'PhD Student in Network Engineering · Universitat Politècnica de Catalunya (UPC)',
  email: 'hafizuddin@upc.edu',
  phone: '', // Intentionally omitted from public GitHub source. Add in the editor if desired.
  location: 'Barcelona, Spain',
  linkedin: 'https://www.linkedin.com/in/hafizuddinso',
  github: 'https://github.com/hafizuddinso',
  orcid: 'https://orcid.org/0009-0004-5596-5691',
  website: '', slug: 'hafizuddin', showPhone: false, showReferences: false,
  summary: 'PhD student in Network Engineering at UPC, with a background in cybersecurity, networking, IoT, and IT operations. My MSc research at LETI involved developing and evaluating a Tor-based communication framework using AES-GCM and ECDH, resulting in a first-author IEEE conference publication and oral presentation. My proposed doctoral research will compare classical, post-quantum, and hybrid circuit-establishment approaches, focusing on performance and traffic-analysis resistance. I also bring practical experience in software development, hardware integration, network administration, and technical training.',
  interests: 'Post-Quantum Cryptography, Tor/Onion Services, Secure Communication, Network and System Security, Privacy-Enhancing Technologies, Threat Modelling, Hardware Security, AI Security, Security Evaluation',
  education: [
    { id: 'edu1', title: 'PhD in Network Engineering', organization: 'Universitat Politècnica de Catalunya (UPC)', location: 'Barcelona, Spain', period: 'October 2026 – Present', details: 'Research topic: Post-Quantum Onion Routing: Security, Performance and Traffic-Analysis Resistance.\nSupervisor: Prof. Juan Hernández Serrano, Department of Network Engineering (ENTEL).\nResearch group: Information Security Group (ISG-MAK).' },
    { id: 'edu2', title: 'MSc in Information Systems and Technologies', organization: 'Saint Petersburg Electrotechnical University (LETI)', location: 'St. Petersburg, Russia', period: 'September 2024 – June 2026', details: 'GPA: 4.62 / 5.00.\nThesis: Framework for Safe Communication in the Non-Indexed Web (Hidden Web).\nSupervisor: Dr. Elena Fedorchenko, Department of Information Security.\nFunding: Open Doors Russian Olympiad Scholarship – Full Sponsorship.' },
    { id: 'edu3', title: 'BSc in Computer Science and Engineering', organization: 'Daffodil International University (DIU)', location: 'Dhaka, Bangladesh', period: 'September 2018 – June 2021', details: 'CGPA: 2.77 / 4.00.\nThesis: IoT-Based Automatic Railway Gate Control System.\nDepartment: Computer Science and Engineering; Faculty: Science and Information Technology.' }
  ],
  research: [
    { id: 'research1', title: 'Onion Communication – Secure Communication for the Hidden Web', organization: 'Saint Petersburg Electrotechnical University (LETI)', location: '', period: 'September 2025 – June 2026', details: 'Designed and implemented a modular three-layer Application–Service–Network architecture for secure communication over Tor/onion-service environments.\nImplemented three experimental communication modes: plaintext baseline, client-side AES-GCM and ECDH-based mode.\nApplied AES-GCM through the Web Crypto API using randomized 96-bit IVs, maintaining encryption and integrity protection entirely on the client side without exposing encryption keys to the server.\nExamined application-layer confidentiality during Tor bootstrapping and connectivity failures, distinguishing message confidentiality from network anonymity and documenting residual traffic-analysis risks.' },
    { id: 'research2', title: 'IoT-Based Automatic Railway Gate Control System', organization: 'Daffodil International University', location: '', period: 'January 2021 – June 2021', details: 'Designed and programmed an Arduino-based prototype automating a railway crossing with IR and ultrasonic sensors.\nIntegrated Arduino Uno, motor-control circuits, servo actuation, and an I2C display to connect sensor inputs with physical outputs.\nEvaluated the prototype against railway-crossing safety requirements and accident data from Bangladesh.' }
  ],
  publications: [
    { id: 'pub1', title: 'Framework for Safe Communication in the Non-Indexed Web', authors: 'Hafizuddin and E. Fedorchenko', venue: 'Proceedings of the 7th International Conference on Neural Networks and Neurotechnologies (NeuroNT 2026), Saint Petersburg, Russia', year: '2026', details: 'First author · IEEE conference paper · Oral presentation, June 2026', url: 'https://doi.org/10.1109/NeuroNT71829.2026.11651421' },
    { id: 'pub2', title: 'Learning from False Positives: Institutional Accountability in AI-Based Threat Detection', authors: 'Hafizuddin', venue: 'Proceedings of Sultangazin Readings 2026, Akhmet Baitursynuly Kostanay Regional University, Kazakhstan', year: '2026', details: 'Sole author · International conference proceedings paper (ISBN), November 2026', url: '' }
  ],
  experience: [
    { id: 'work1', title: 'Director of Operations', organization: 'ByteQuill', location: 'Dhaka, Bangladesh – Hybrid', period: 'February 2023 – November 2024', details: 'Managed web and network infrastructure across client environments and coordinated operational security practices.\nLed technical teams, client relationships, project delivery, and technology-roadmap planning.\nEstablished internal code-review, technical-documentation, and operational standards.' },
    { id: 'work2', title: 'IT Supervisor', organization: 'Tagore University of Creative Arts (TUCA)', location: 'Dhaka, Bangladesh – Hybrid', period: 'November 2022 – November 2024', details: 'Coordinated security hardening across institutional servers, networks, and endpoints, including vulnerability assessment and firewall configuration.\nManaged server administration, databases, network operations, backup procedures, and disaster-recovery processes.\nSupervised institutional IT operations and coordinated technical support across academic and administrative units.' }
  ],
  projects: [{ id: 'project1', title: 'Nomad Wealth – Personal Finance and Investment Tracking Platform', year: '2026', details: 'Web and native Android/iOS applications. Developed a cross-platform dashboard for account, transaction, budget, investment, and savings-goal tracking. Worked on JavaScript web, Kotlin Android, and SwiftUI iOS clients using shared Supabase authentication and finance workspaces.', url: 'https://github.com/hafizuddinso/nomad-wealth' }],
  skillsSummary: 'Research and applied technical skills spanning security, privacy, software engineering and infrastructure.',
  skills: [
    { label: 'Security & Privacy', content: 'Tor, Onion Routing, Anonymous Networks, AES-GCM, ECDH, symmetric/asymmetric cryptography, hashing, SSL/TLS, VPN, IDS/IPS, Threat Modelling' },
    { label: 'Security Tools', content: 'Wireshark, Burp Suite, Metasploit, Nmap, Tor stack, Web Crypto API' },
    { label: 'Programming', content: 'Python, C/C++, JavaScript, Kotlin, Swift, SQL, Bash' },
    { label: 'Systems & Infrastructure', content: 'Linux (Ubuntu, Kali), macOS, Windows Server, server administration, networking' },
    { label: 'Development & Data', content: 'Git/GitHub, Supabase, REST APIs, MySQL, PostgreSQL, web application development' },
    { label: 'Hardware & IoT', content: 'Arduino Uno, Raspberry Pi, microcontrollers, sensors, motor control, circuit integration, hardware troubleshooting' },
    { label: 'Research', content: 'LaTeX, Experimental Design, Threat Analysis, Technical Documentation, Security Evaluation' }
  ],
  teaching: 'CBTA Level-4 Certified Assessor & Trainer, National Skills Development Authority (NSDA), Bangladesh – qualified to train and assess learners in competency-based technical programmes.\nSupervised and coordinated technical team members and institutional IT users at ByteQuill and TUCA, providing hands-on guidance and technical support.',
  awards: 'Open Doors Russian Olympiad Scholarship, 2024 – Full sponsorship for MSc studies at ETU LETI.\nInternational Volunteer Award, Bharat-Bangladesh Sanghati Foundation, 2024.\nNational Gold Medal in Inter University Sports Camp 2019, BIUSC 2019, Dhaka.',
  certifications: 'Computer Operation Level-3 – NSDA, Bangladesh.\nIBM Cybersecurity Analyst Professional Certificate.\nPalo Alto Networks – Cybersecurity Fundamentals.\nComputer Network Security – University of Colorado Boulder.\nGoogle IT Support Professional Certificate.',
  languages: 'Bengali: Native · English: Fluent · Hindi/Urdu: Conversational · Russian: Beginner · Spanish: Beginner',
  references: '' // Private reference contact details are intentionally not seeded into public source.
};

export const emptyEntry = (): Entry => ({ id: `e${Date.now()}${Math.random().toString(36).slice(2, 5)}`, title: '', organization: '', location: '', period: '', details: '' });
export const emptyPublication = (): Publication => ({ id: `p${Date.now()}`, title: '', authors: '', venue: '', year: '', details: '', url: '' });
export const emptyProject = (): Project => ({ id: `pr${Date.now()}`, title: '', year: '', details: '', url: '' });

export function safeExternalUrl(input: string): string | null {
  if (!input) return null;
  try { const url = new URL(input); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
export function normalizeSlug(s: string): string { return s.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50); }
