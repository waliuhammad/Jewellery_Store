'use client';

import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { AboutContent } from '@/lib/validations/content';

const input = 'w-full rounded-button border border-rose-border bg-card px-3 py-2 text-sm focus:border-rose focus:outline-none';

type FormValues = {
  heroTitle: string;
  heroIntro: string;
  heroImage: AboutContent['heroImage'];
  storyHeading: string;
  storyText: string;
  philosophyHeading: string;
  philosophyBody: string;
  craftsmanshipHeading: string;
  craftsmanship: { title: string; body: string }[];
  materials: { name: string; description: string }[];
};

function toForm(c: AboutContent): FormValues {
  return {
    heroTitle: c.heroTitle,
    heroIntro: c.heroIntro,
    heroImage: c.heroImage,
    storyHeading: c.storyHeading,
    storyText: c.story.join('\n\n'),
    philosophyHeading: c.philosophyHeading,
    philosophyBody: c.philosophyBody,
    craftsmanshipHeading: c.craftsmanshipHeading,
    craftsmanship: c.craftsmanship,
    materials: c.materials,
  };
}

/** Paragraphs are separated by a blank line in the text box. */
function fromForm(v: FormValues): AboutContent {
  return {
    heroTitle: v.heroTitle,
    heroIntro: v.heroIntro,
    heroImage: v.heroImage,
    storyHeading: v.storyHeading,
    story: v.storyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    philosophyHeading: v.philosophyHeading,
    philosophyBody: v.philosophyBody,
    craftsmanshipHeading: v.craftsmanshipHeading,
    craftsmanship: v.craftsmanship,
    materials: v.materials,
  };
}

export function AboutForm({ initial }: { initial: AboutContent }) {
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({ defaultValues: toForm(initial) });
  const craft = useFieldArray({ control, name: 'craftsmanship' });
  const materials = useFieldArray({ control, name: 'materials' });

  const onSubmit = async (values: FormValues) => {
    setMessage(null);
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fromForm(values)),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ kind: 'error', text: body.error ?? 'Could not save. Check the fields and try again.' });
      return;
    }
    setMessage({ kind: 'ok', text: 'Brand content saved. The About page is updated.' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-10">
      <fieldset className="space-y-5">
        <legend className="font-heading text-2xl">Hero</legend>
        <div>
          <label htmlFor="heroTitle" className="mb-1 block text-sm">Heading</label>
          <input id="heroTitle" className={input} {...register('heroTitle')} />
        </div>
        <div>
          <label htmlFor="heroIntro" className="mb-1 block text-sm">Introduction</label>
          <textarea id="heroIntro" rows={2} className={input} {...register('heroIntro')} />
        </div>
        <Controller
          control={control}
          name="heroImage"
          render={({ field }) => (
            <ImageUploader
              value={field.value ? [field.value] : []}
              onChange={(imgs) => field.onChange(imgs[imgs.length - 1] ?? null)}
            />
          )}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-heading text-2xl">Brand story</legend>
        <div>
          <label htmlFor="storyHeading" className="mb-1 block text-sm">Heading</label>
          <input id="storyHeading" className={input} {...register('storyHeading')} />
        </div>
        <div>
          <label htmlFor="storyText" className="mb-1 block text-sm">Story</label>
          <textarea id="storyText" rows={8} className={input} {...register('storyText')} />
          <p className="mt-1 text-xs text-muted">Separate paragraphs with a blank line.</p>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-heading text-2xl">Design philosophy</legend>
        <div>
          <label htmlFor="philosophyHeading" className="mb-1 block text-sm">Heading</label>
          <input id="philosophyHeading" className={input} {...register('philosophyHeading')} />
        </div>
        <div>
          <label htmlFor="philosophyBody" className="mb-1 block text-sm">Text</label>
          <textarea id="philosophyBody" rows={5} className={input} {...register('philosophyBody')} />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-heading text-2xl">Craftsmanship</legend>
        <div>
          <label htmlFor="craftsmanshipHeading" className="mb-1 block text-sm">Heading</label>
          <input id="craftsmanshipHeading" className={input} {...register('craftsmanshipHeading')} />
        </div>
        {craft.fields.map((f, i) => (
          <div key={f.id} className="space-y-2 rounded-card border border-rose-border bg-card p-4">
            <input aria-label={`Section ${i + 1} title`} placeholder="Title" className={input} {...register(`craftsmanship.${i}.title`)} />
            <textarea aria-label={`Section ${i + 1} text`} placeholder="Text" rows={3} className={input} {...register(`craftsmanship.${i}.body`)} />
            <button type="button" onClick={() => craft.remove(i)} className="text-xs text-muted underline underline-offset-4 hover:text-ink">Remove section</button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => craft.append({ title: '', body: '' })} disabled={craft.fields.length >= 8}>
          Add section
        </Button>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-heading text-2xl">Materials</legend>
        {materials.fields.map((f, i) => (
          <div key={f.id} className="space-y-2 rounded-card border border-rose-border bg-card p-4">
            <input aria-label={`Material ${i + 1} name`} placeholder="Name" className={input} {...register(`materials.${i}.name`)} />
            <textarea aria-label={`Material ${i + 1} description`} placeholder="Origin, finish and care" rows={2} className={input} {...register(`materials.${i}.description`)} />
            <button type="button" onClick={() => materials.remove(i)} className="text-xs text-muted underline underline-offset-4 hover:text-ink">Remove material</button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => materials.append({ name: '', description: '' })} disabled={materials.fields.length >= 12}>
          Add material
        </Button>
      </fieldset>

      {message && <p role={message.kind === 'error' ? 'alert' : 'status'} className="text-sm">{message.text}</p>}
      <Button type="submit" disabled={isSubmitting}>Save brand content</Button>
    </form>
  );
}
