/**
 * Curated present-tense (Präsens) conjugations for high-frequency German verbs.
 *
 * Hand-checked rather than rule-generated, because the most common verbs are
 * exactly the ones with irregular stems (sein, haben), vowel changes
 * (geben→gibst, fahren→fährst) and modal quirks (können→kann) that rules miss.
 *
 * `present` order matches PRONOUNS: ich · du · er/sie/es · wir · ihr · sie/Sie.
 */
export type Person = 0 | 1 | 2 | 3 | 4 | 5;
export const PRONOUNS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'] as const;

export interface Verb {
  infinitive: string;
  en: string;
  irregular?: boolean;
  present: [string, string, string, string, string, string];
}

export const VERBS: Verb[] = [
  // --- Essentials (highly irregular) ---
  { infinitive: 'sein', en: 'to be', irregular: true, present: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'] },
  { infinitive: 'haben', en: 'to have', irregular: true, present: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'] },
  { infinitive: 'werden', en: 'to become', irregular: true, present: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'] },
  { infinitive: 'wissen', en: 'to know (a fact)', irregular: true, present: ['weiß', 'weißt', 'weiß', 'wissen', 'wisst', 'wissen'] },

  // --- Modal verbs (irregular singular) ---
  { infinitive: 'können', en: 'can / to be able to', irregular: true, present: ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'] },
  { infinitive: 'müssen', en: 'must / to have to', irregular: true, present: ['muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen'] },
  { infinitive: 'wollen', en: 'to want', irregular: true, present: ['will', 'willst', 'will', 'wollen', 'wollt', 'wollen'] },
  { infinitive: 'sollen', en: 'should / ought to', irregular: true, present: ['soll', 'sollst', 'soll', 'sollen', 'sollt', 'sollen'] },
  { infinitive: 'dürfen', en: 'may / to be allowed to', irregular: true, present: ['darf', 'darfst', 'darf', 'dürfen', 'dürft', 'dürfen'] },
  { infinitive: 'mögen', en: 'to like', irregular: true, present: ['mag', 'magst', 'mag', 'mögen', 'mögt', 'mögen'] },

  // --- Strong verbs: e → i / ie ---
  { infinitive: 'geben', en: 'to give', irregular: true, present: ['gebe', 'gibst', 'gibt', 'geben', 'gebt', 'geben'] },
  { infinitive: 'nehmen', en: 'to take', irregular: true, present: ['nehme', 'nimmst', 'nimmt', 'nehmen', 'nehmt', 'nehmen'] },
  { infinitive: 'sprechen', en: 'to speak', irregular: true, present: ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'] },
  { infinitive: 'essen', en: 'to eat', irregular: true, present: ['esse', 'isst', 'isst', 'essen', 'esst', 'essen'] },
  { infinitive: 'lesen', en: 'to read', irregular: true, present: ['lese', 'liest', 'liest', 'lesen', 'lest', 'lesen'] },
  { infinitive: 'sehen', en: 'to see', irregular: true, present: ['sehe', 'siehst', 'sieht', 'sehen', 'seht', 'sehen'] },
  { infinitive: 'helfen', en: 'to help', irregular: true, present: ['helfe', 'hilfst', 'hilft', 'helfen', 'helft', 'helfen'] },
  { infinitive: 'treffen', en: 'to meet', irregular: true, present: ['treffe', 'triffst', 'trifft', 'treffen', 'trefft', 'treffen'] },
  { infinitive: 'vergessen', en: 'to forget', irregular: true, present: ['vergesse', 'vergisst', 'vergisst', 'vergessen', 'vergesst', 'vergessen'] },

  // --- Strong verbs: a → ä (and au → äu) ---
  { infinitive: 'fahren', en: 'to drive / go', irregular: true, present: ['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'] },
  { infinitive: 'schlafen', en: 'to sleep', irregular: true, present: ['schlafe', 'schläfst', 'schläft', 'schlafen', 'schlaft', 'schlafen'] },
  { infinitive: 'tragen', en: 'to carry / wear', irregular: true, present: ['trage', 'trägst', 'trägt', 'tragen', 'tragt', 'tragen'] },
  { infinitive: 'laufen', en: 'to run / walk', irregular: true, present: ['laufe', 'läufst', 'läuft', 'laufen', 'lauft', 'laufen'] },
  { infinitive: 'fallen', en: 'to fall', irregular: true, present: ['falle', 'fällst', 'fällt', 'fallen', 'fallt', 'fallen'] },
  { infinitive: 'halten', en: 'to hold / stop', irregular: true, present: ['halte', 'hältst', 'hält', 'halten', 'haltet', 'halten'] },
  { infinitive: 'lassen', en: 'to let / leave', irregular: true, present: ['lasse', 'lässt', 'lässt', 'lassen', 'lasst', 'lassen'] },

  // --- Regular verbs with a spelling twist (stem in -t/-d/-s/-ß/-z) ---
  { infinitive: 'arbeiten', en: 'to work', present: ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeitet', 'arbeiten'] },
  { infinitive: 'warten', en: 'to wait', present: ['warte', 'wartest', 'wartet', 'warten', 'wartet', 'warten'] },
  { infinitive: 'finden', en: 'to find', present: ['finde', 'findest', 'findet', 'finden', 'findet', 'finden'] },
  { infinitive: 'reden', en: 'to talk', present: ['rede', 'redest', 'redet', 'reden', 'redet', 'reden'] },
  { infinitive: 'öffnen', en: 'to open', present: ['öffne', 'öffnest', 'öffnet', 'öffnen', 'öffnet', 'öffnen'] },
  { infinitive: 'heißen', en: 'to be called', present: ['heiße', 'heißt', 'heißt', 'heißen', 'heißt', 'heißen'] },
  { infinitive: 'tanzen', en: 'to dance', present: ['tanze', 'tanzt', 'tanzt', 'tanzen', 'tanzt', 'tanzen'] },
  { infinitive: 'reisen', en: 'to travel', present: ['reise', 'reist', 'reist', 'reisen', 'reist', 'reisen'] },

  // --- Common regular (weak) verbs ---
  { infinitive: 'machen', en: 'to do / make', present: ['mache', 'machst', 'macht', 'machen', 'macht', 'machen'] },
  { infinitive: 'sagen', en: 'to say', present: ['sage', 'sagst', 'sagt', 'sagen', 'sagt', 'sagen'] },
  { infinitive: 'spielen', en: 'to play', present: ['spiele', 'spielst', 'spielt', 'spielen', 'spielt', 'spielen'] },
  { infinitive: 'lernen', en: 'to learn', present: ['lerne', 'lernst', 'lernt', 'lernen', 'lernt', 'lernen'] },
  { infinitive: 'wohnen', en: 'to live / reside', present: ['wohne', 'wohnst', 'wohnt', 'wohnen', 'wohnt', 'wohnen'] },
  { infinitive: 'kaufen', en: 'to buy', present: ['kaufe', 'kaufst', 'kauft', 'kaufen', 'kauft', 'kaufen'] },
  { infinitive: 'fragen', en: 'to ask', present: ['frage', 'fragst', 'fragt', 'fragen', 'fragt', 'fragen'] },
  { infinitive: 'brauchen', en: 'to need', present: ['brauche', 'brauchst', 'braucht', 'brauchen', 'braucht', 'brauchen'] },
  { infinitive: 'glauben', en: 'to believe', present: ['glaube', 'glaubst', 'glaubt', 'glauben', 'glaubt', 'glauben'] },
  { infinitive: 'lieben', en: 'to love', present: ['liebe', 'liebst', 'liebt', 'lieben', 'liebt', 'lieben'] },
  { infinitive: 'hören', en: 'to hear', present: ['höre', 'hörst', 'hört', 'hören', 'hört', 'hören'] },
  { infinitive: 'kommen', en: 'to come', present: ['komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen'] },
  { infinitive: 'gehen', en: 'to go', present: ['gehe', 'gehst', 'geht', 'gehen', 'geht', 'gehen'] },
  { infinitive: 'stehen', en: 'to stand', present: ['stehe', 'stehst', 'steht', 'stehen', 'steht', 'stehen'] },
  { infinitive: 'verstehen', en: 'to understand', present: ['verstehe', 'verstehst', 'versteht', 'verstehen', 'versteht', 'verstehen'] },
  { infinitive: 'bleiben', en: 'to stay', present: ['bleibe', 'bleibst', 'bleibt', 'bleiben', 'bleibt', 'bleiben'] },
  { infinitive: 'schreiben', en: 'to write', present: ['schreibe', 'schreibst', 'schreibt', 'schreiben', 'schreibt', 'schreiben'] },
  { infinitive: 'trinken', en: 'to drink', present: ['trinke', 'trinkst', 'trinkt', 'trinken', 'trinkt', 'trinken'] },
  { infinitive: 'denken', en: 'to think', present: ['denke', 'denkst', 'denkt', 'denken', 'denkt', 'denken'] },
  { infinitive: 'bringen', en: 'to bring', present: ['bringe', 'bringst', 'bringt', 'bringen', 'bringt', 'bringen'] },
];

/** Accept umlaut/ß typed either natively or as ASCII (ä→ae, ö→oe, ü→ue, ß→ss). */
export function normalizeGerman(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

export function checkConjugation(input: string, expected: string): boolean {
  return normalizeGerman(input) === normalizeGerman(expected);
}
