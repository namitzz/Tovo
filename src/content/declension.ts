/**
 * German article declension — the der/die/das and ein-word tables across the
 * four cases. This is the grammar learners struggle with most, and it's fully
 * rule-based, so the trainer works offline from these small hand-checked tables.
 *
 * Table column order matches CASES: Nominative · Accusative · Dative · Genitive.
 */
export const CASES = ['Nominative', 'Accusative', 'Dative', 'Genitive'] as const;
export type CaseIndex = 0 | 1 | 2 | 3;

export type Gender = 'masc' | 'fem' | 'neut' | 'plural';
export type ArticleType = 'definite' | 'indefinite';

// der/die/das
const DEFINITE: Record<Gender, [string, string, string, string]> = {
  masc: ['der', 'den', 'dem', 'des'],
  fem: ['die', 'die', 'der', 'der'],
  neut: ['das', 'das', 'dem', 'des'],
  plural: ['die', 'die', 'den', 'der'],
};

// ein/eine/… (no plural — German uses "keine"/bare nouns there)
const INDEFINITE: Record<Exclude<Gender, 'plural'>, [string, string, string, string]> = {
  masc: ['ein', 'einen', 'einem', 'eines'],
  fem: ['eine', 'eine', 'einer', 'einer'],
  neut: ['ein', 'ein', 'einem', 'eines'],
};

export const DEFINITE_OPTIONS = ['der', 'die', 'das', 'den', 'dem', 'des'];
export const INDEFINITE_OPTIONS = ['ein', 'eine', 'einen', 'einem', 'einer', 'eines'];

/** Sample nouns per gender/number for context (kept small and unambiguous). */
export const NOUNS: Record<Gender, { de: string; en: string }[]> = {
  masc: [
    { de: 'Mann', en: 'man' },
    { de: 'Hund', en: 'dog' },
    { de: 'Tisch', en: 'table' },
    { de: 'Apfel', en: 'apple' },
  ],
  fem: [
    { de: 'Frau', en: 'woman' },
    { de: 'Katze', en: 'cat' },
    { de: 'Blume', en: 'flower' },
    { de: 'Stadt', en: 'city' },
  ],
  neut: [
    { de: 'Kind', en: 'child' },
    { de: 'Haus', en: 'house' },
    { de: 'Buch', en: 'book' },
    { de: 'Auto', en: 'car' },
  ],
  plural: [
    { de: 'Kinder', en: 'children' },
    { de: 'Häuser', en: 'houses' },
    { de: 'Bücher', en: 'books' },
    { de: 'Leute', en: 'people' },
  ],
};

export const GENDER_LABEL: Record<Gender, string> = {
  masc: 'masculine',
  fem: 'feminine',
  neut: 'neuter',
  plural: 'plural',
};

export function correctArticle(type: ArticleType, gender: Gender, c: CaseIndex): string {
  if (type === 'indefinite') {
    if (gender === 'plural') return DEFINITE.plural[c]; // fallback; not generated
    return INDEFINITE[gender][c];
  }
  return DEFINITE[gender][c];
}

export function optionsFor(type: ArticleType): string[] {
  return type === 'definite' ? DEFINITE_OPTIONS : INDEFINITE_OPTIONS;
}
