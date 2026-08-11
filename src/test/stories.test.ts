import { describe, it, expect } from 'vitest';
import { STORIES } from '../content/stories';

describe('stories content', () => {
  it('every story is well-formed and level-aligned lines', () => {
    for (const s of STORIES) {
      expect(s.id).toMatch(/^[a-z0-9-]+$/);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.titleEn.length).toBeGreaterThan(0);
      expect(['A1', 'A2', 'B1']).toContain(s.level);
      expect(s.lines.length).toBeGreaterThanOrEqual(4);
      for (const l of s.lines) {
        expect(l.de.trim().length).toBeGreaterThan(0);
        expect(l.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has unique story ids', () => {
    const ids = STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
