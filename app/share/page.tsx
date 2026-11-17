'use client';

import { useEffect, useState } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import CVDocument from '@/components/CVDocument';
import type { CVData } from '@/lib/cv';
import { parseSharedCV } from '@/lib/share';

export default function SharedCVPage() {
  const [cv, setCV] = useState<CVData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    parseSharedCV(window.location.hash).then(setCV).catch(e => setError(e instanceof Error ? e.message : 'Could not open this CV.'));
  }, []);
  return <div className="public-wrap">
    <div className="public-toolbar"><a href="/" className="brand-mini">ACADEMIC CV <span>/ SHARED PROFILE</span></a>
      {cv && <button type="button" className="btn btn-primary" onClick={() => window.print()}><Download size={15}/> Save as PDF</button>}
    </div>
    {cv ? <div className="public-paper"><CVDocument cv={cv}/></div> :
      <div className="shared-empty"><h1>{error ? 'Unable to open this CV' : 'Opening shared CV…'}</h1><p>{error || 'Decoding the CV in your browser.'}</p><a href="/" className="btn btn-outline"><ArrowLeft size={15}/> Back to editor</a></div>}
  </div>;
}
