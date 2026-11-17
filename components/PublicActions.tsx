'use client';
import { Download } from 'lucide-react';
export default function PublicActions() {
  return <button type="button" className="btn btn-primary" onClick={() => window.print()}><Download size={15}/> Save as PDF</button>;
}
