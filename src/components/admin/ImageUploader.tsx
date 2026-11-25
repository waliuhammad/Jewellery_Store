'use client';

import { useState } from 'react';
import type { ProductImage } from '@/types/catalog';

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGES = 8;

type UploadResult = { secure_url: string; public_id: string };

/** Sends the file straight to Cloudinary with progress. Uses the server-issued signature only. */
function sendWithProgress(url: string, body: FormData, onProgress: (pct: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let json: { secure_url?: string; public_id?: string; error?: { message?: string } } = {};
      try {
        json = JSON.parse(xhr.responseText || '{}');
      } catch {
        /* non-JSON response falls through to the generic error */
      }
      if (xhr.status < 300 && json.secure_url && json.public_id) {
        resolve({ secure_url: json.secure_url, public_id: json.public_id });
      } else {
        reject(new Error(json.error?.message ?? 'Upload failed. Please try again.'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.send(body);
  });
}

export function ImageUploader({ value, onChange }: { value: ProductImage[]; onChange: (v: ProductImage[]) => void }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    if (!TYPES.includes(file.type)) return setError('Use a JPG, PNG or WebP image.');
    if (file.size > MAX_BYTES) return setError('Image must be 5 MB or smaller.');
    if (value.length >= MAX_IMAGES) return setError(`Up to ${MAX_IMAGES} images per product.`);

    try {
      const sigRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose: 'products' }),
      });
      if (!sigRes.ok) throw new Error('Uploads are not available right now.');
      const sig = await sigRes.json();

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sig.apiKey);
      form.append('timestamp', String(sig.timestamp));
      form.append('signature', sig.signature);
      form.append('folder', sig.folder);
      form.append('allowed_formats', sig.allowed_formats);

      setProgress(0);
      const result = await sendWithProgress(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        form,
        setProgress,
      );
      onChange([
        ...value,
        { url: result.secure_url, publicId: result.public_id, alt: file.name.replace(/\.[^.]+$/, '').slice(0, 200) },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setProgress(null);
    }
  };

  const setAlt = (i: number, alt: string) =>
    onChange(value.map((img, idx) => (idx === i ? { ...img, alt } : img)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="image-upload" className="mb-1 block text-sm">Product images</label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={progress !== null}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = '';
          }}
          className="block text-sm file:mr-4 file:rounded-button file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-white"
        />
        {progress !== null && (
          <p role="status" className="mt-2 text-sm text-muted">Uploading… {progress}%</p>
        )}
        {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      </div>

      {value.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {value.map((img, i) => (
            <li key={img.publicId ?? i} className="flex gap-3 rounded-card border border-rose-border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-20 w-16 rounded-button object-cover" />
              <div className="flex-1 space-y-2">
                <label className="block text-xs text-muted" htmlFor={`alt-${i}`}>Alt text</label>
                <input
                  id={`alt-${i}`}
                  value={img.alt}
                  onChange={(e) => setAlt(i, e.target.value)}
                  className="w-full rounded-button border border-rose-border px-2 py-1 text-sm"
                />
                <button type="button" onClick={() => remove(i)} className="text-xs text-red-700 underline-offset-4 hover:underline">
                  Remove image
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
