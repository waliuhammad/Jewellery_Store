import 'server-only';
import { adminDb, isAdminConfigured } from '@/lib/firebase/admin';
import { aboutContentSchema, type AboutContent } from '@/lib/validations/content';
import { DEFAULT_ABOUT } from '@/lib/content/defaults';

/** Reads the brand content saved in settings/about. Falls back to the defaults if missing or invalid. */
export async function getAboutContent(): Promise<AboutContent> {
  if (!isAdminConfigured()) return DEFAULT_ABOUT;
  try {
    const snap = await adminDb().collection('settings').doc('about').get();
    if (!snap.exists) return DEFAULT_ABOUT;
    const parsed = aboutContentSchema.safeParse(snap.data());
    return parsed.success ? parsed.data : DEFAULT_ABOUT;
  } catch (err) {
    console.error('[content] could not read about content', err);
    return DEFAULT_ABOUT;
  }
}
