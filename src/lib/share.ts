import type { CVData } from './cv';

// Browser-only gzip + base64url. The fragment (after #) is not transmitted in HTTP requests.
const MAX_SHARE_CHARACTERS = 12000;

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 32768) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeBase64Url(text: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(text)) throw new Error('Invalid link format.');
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
  return Uint8Array.from(raw, char => char.charCodeAt(0));
}
async function compress(input: string): Promise<Uint8Array> {
  if (typeof CompressionStream === 'undefined') throw new Error('Use a modern browser to create share links.');
  const blob = new Blob([input]);
  const stream = blob.stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function decompress(bytes: Uint8Array): Promise<string> {
  if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot open compressed share links.');
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

export async function createShareUrl(cv: CVData): Promise<string> {
  const shareable = { ...cv, phone: cv.showPhone ? cv.phone : '', references: cv.showReferences ? cv.references : '' };
  const encoded = encodeBase64Url(await compress(JSON.stringify(shareable)));
  if (encoded.length > MAX_SHARE_CHARACTERS) {
    throw new Error('This CV is too large for a reliable share link. Download your JSON backup or shorten the content.');
  }
  return `${window.location.origin}/share#cv=${encoded}`;
}
export async function parseSharedCV(fragment: string): Promise<CVData> {
  const encoded = new URLSearchParams(fragment.replace(/^#/, '')).get('cv');
  if (!encoded || encoded.length > MAX_SHARE_CHARACTERS) throw new Error('This CV link is missing or too large.');
  const value: unknown = JSON.parse(await decompress(decodeBase64Url(encoded)));
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid CV data.');
  const item = value as Partial<CVData>;
  if (typeof item.name !== 'string' || typeof item.summary !== 'string' || !Array.isArray(item.education)) {
    throw new Error('This link does not contain a supported CV.');
  }
  return item as CVData;
}
