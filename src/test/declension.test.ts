import { describe, it, expect } from 'vitest';
import {
  CASES,
  correctArticle,
  optionsFor,
  DEFINITE_OPTIONS,
  INDEFINITE_OPTIONS,
  NOUNS,
  type CaseIndex,
  type Gender,
} from '../content/declension';

describe('declension tables', () => {
  it('spot-checks the definite article paradigm', () => {
    expect(correctArticle('definite', 'masc', 0)).toBe('der'); // Nominative
    expect(correctArticle('definite', 'masc', 1)).toBe('den'); // Accusative
    expect(correctArticle('definite', 'masc', 2)).toBe('dem'); // Dative
    expect(correctArticle('definite', 'masc', 3)).toBe('des'); // Genitive
    expect(correctArticle('definite', 'fem', 2)).toBe('der'); // dative fem
    expect(correctArticle('definite', 'neut', 0)).toBe('das');
    expect(correctArticle('definite', 'plural', 2)).toBe('den'); // dative plural -n
  });

  it('spot-checks the indefinite article paradigm', () => {
    expect(correctArticle('indefinite', 'masc', 1)).toBe('einen');
    expect(correctArticle('indefinite', 'fem', 2)).toBe('einer');
    expect(correctArticle('indefinite', 'neut', 0)).toBe('ein');
  });

  it('every produced answer is present in its option set', () => {
    const genders: Gender[] = ['masc', 'fem', 'neut', 'plural'];
    for (const type of ['definite', 'indefinite'] as const) {
      const opts = optionsFor(type);
      for (const g of genders) {
        if (type === 'indefinite' && g === 'plural') continue;
        for (let c = 0 as CaseIndex; c < 4; c = (c + 1) as CaseIndex) {
          expect(opts).toContain(correctArticle(type, g, c));
        }
      }
    }
    expect(DEFINITE_OPTIONS).toHaveLength(6);
    expect(INDEFINITE_OPTIONS).toHaveLength(6);
    expect(CASES).toHaveLength(4);
  });

  it('has sample nouns for every gender/number', () => {
    for (const g of ['masc', 'fem', 'neut', 'plural'] as Gender[]) {
      expect(NOUNS[g].length).toBeGreaterThan(0);
    }
  });
});
