import { describe, it, expect } from 'vitest';
import { VERBS, PRONOUNS, checkConjugation, normalizeGerman } from '../content/verbs';

describe('verb data', () => {
  it('every verb has 6 non-empty present forms and English', () => {
    for (const v of VERBS) {
      expect(v.present).toHaveLength(6);
      expect(v.en.length).toBeGreaterThan(0);
      for (const form of v.present) expect(form.trim().length).toBeGreaterThan(0);
    }
    expect(PRONOUNS).toHaveLength(6);
  });

  it('has no duplicate infinitives', () => {
    const set = new Set(VERBS.map((v) => v.infinitive));
    expect(set.size).toBe(VERBS.length);
  });

  it('spot-checks known conjugations', () => {
    const by = (inf: string) => VERBS.find((v) => v.infinitive === inf)!.present;
    expect(by('sein')).toEqual(['bin', 'bist', 'ist', 'sind', 'seid', 'sind']);
    expect(by('haben')[1]).toBe('hast');
    expect(by('geben')[1]).toBe('gibst'); // e -> i
    expect(by('fahren')[2]).toBe('fährt'); // a -> ä
    expect(by('können')[0]).toBe('kann'); // modal
  });
});

describe('checkConjugation', () => {
  it('is case- and whitespace-insensitive', () => {
    expect(checkConjugation('  Gibst ', 'gibst')).toBe(true);
  });

  it('accepts ASCII umlaut spellings', () => {
    expect(checkConjugation('faehrst', 'fährst')).toBe(true);
    expect(checkConjugation('laeuft', 'läuft')).toBe(true);
    expect(normalizeGerman('groß')).toBe('gross');
  });

  it('rejects wrong forms', () => {
    expect(checkConjugation('gebst', 'gibst')).toBe(false);
  });
});
