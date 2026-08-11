/**
 * Short graded reading texts (comprehensible input). Each story is aligned line
 * by line to an English translation, so the reader can show translations and
 * play audio per sentence without any machine translation. German is simple and
 * hand-written for each CEFR level.
 */
import type { CEFRLevel } from '../types';

export interface Story {
  id: string;
  title: string;
  titleEn: string;
  level: Extract<CEFRLevel, 'A1' | 'A2' | 'B1'>;
  emoji: string;
  lines: { de: string; en: string }[];
}

export const STORIES: Story[] = [
  {
    id: 'mein-morgen',
    title: 'Mein Morgen',
    titleEn: 'My Morning',
    level: 'A1',
    emoji: '☀️',
    lines: [
      { de: 'Ich stehe jeden Tag um sieben Uhr auf.', en: 'I get up at seven o’clock every day.' },
      { de: 'Zuerst trinke ich einen Kaffee.', en: 'First I drink a coffee.' },
      { de: 'Dann esse ich ein Brötchen mit Käse.', en: 'Then I eat a roll with cheese.' },
      { de: 'Ich fahre mit dem Bus zur Arbeit.', en: 'I take the bus to work.' },
      { de: 'Die Arbeit beginnt um neun Uhr.', en: 'Work begins at nine o’clock.' },
    ],
  },
  {
    id: 'im-cafe',
    title: 'Im Café',
    titleEn: 'In the Café',
    level: 'A1',
    emoji: '☕',
    lines: [
      { de: 'Anna geht in ein Café.', en: 'Anna goes into a café.' },
      { de: 'Sie bestellt einen Tee und ein Stück Kuchen.', en: 'She orders a tea and a piece of cake.' },
      { de: 'Der Kellner bringt alles schnell.', en: 'The waiter brings everything quickly.' },
      { de: 'Der Kuchen schmeckt sehr gut.', en: 'The cake tastes very good.' },
      { de: 'Anna bezahlt und geht nach Hause.', en: 'Anna pays and goes home.' },
    ],
  },
  {
    id: 'meine-familie',
    title: 'Meine Familie',
    titleEn: 'My Family',
    level: 'A1',
    emoji: '👪',
    lines: [
      { de: 'Ich habe eine kleine Familie.', en: 'I have a small family.' },
      { de: 'Meine Mutter heißt Maria und mein Vater heißt Thomas.', en: 'My mother is called Maria and my father is called Thomas.' },
      { de: 'Ich habe auch einen Bruder.', en: 'I also have a brother.' },
      { de: 'Wir wohnen zusammen in einem Haus.', en: 'We live together in a house.' },
      { de: 'Am Abend essen wir oft zusammen.', en: 'In the evening we often eat together.' },
    ],
  },
  {
    id: 'tag-am-see',
    title: 'Ein Tag am See',
    titleEn: 'A Day at the Lake',
    level: 'A2',
    emoji: '🏞️',
    lines: [
      { de: 'Am Samstag fahren wir an den See.', en: 'On Saturday we drive to the lake.' },
      { de: 'Das Wetter ist schön und die Sonne scheint.', en: 'The weather is nice and the sun is shining.' },
      { de: 'Wir schwimmen im Wasser und liegen in der Sonne.', en: 'We swim in the water and lie in the sun.' },
      { de: 'Mittags machen wir ein Picknick.', en: 'At midday we have a picnic.' },
      { de: 'Am Nachmittag spielen die Kinder am Strand.', en: 'In the afternoon the children play on the beach.' },
      { de: 'Abends sind wir müde, aber glücklich.', en: 'In the evening we are tired but happy.' },
    ],
  },
  {
    id: 'einkaufen',
    title: 'Einkaufen im Supermarkt',
    titleEn: 'Shopping at the Supermarket',
    level: 'A2',
    emoji: '🛒',
    lines: [
      { de: 'Heute muss ich einkaufen gehen.', en: 'Today I have to go shopping.' },
      { de: 'Ich brauche Obst, Gemüse und Brot.', en: 'I need fruit, vegetables and bread.' },
      { de: 'Im Supermarkt ist es sehr voll.', en: 'In the supermarket it is very crowded.' },
      { de: 'Ich suche lange nach der Milch.', en: 'I look for the milk for a long time.' },
      { de: 'An der Kasse bezahle ich mit Karte.', en: 'At the checkout I pay by card.' },
      { de: 'Dann trage ich die Taschen nach Hause.', en: 'Then I carry the bags home.' },
    ],
  },
  {
    id: 'wochenende',
    title: 'Das Wochenende',
    titleEn: 'The Weekend',
    level: 'A2',
    emoji: '🎬',
    lines: [
      { de: 'Am Wochenende habe ich viel Zeit.', en: 'On the weekend I have a lot of time.' },
      { de: 'Am Samstagmorgen gehe ich joggen.', en: 'On Saturday morning I go jogging.' },
      { de: 'Danach treffe ich meine Freunde in der Stadt.', en: 'Afterwards I meet my friends in the city.' },
      { de: 'Wir gehen zusammen ins Kino.', en: 'We go to the cinema together.' },
      { de: 'Am Sonntag bleibe ich zu Hause und lese ein Buch.', en: 'On Sunday I stay at home and read a book.' },
    ],
  },
  {
    id: 'verlorene-schluessel',
    title: 'Der verlorene Schlüssel',
    titleEn: 'The Lost Key',
    level: 'B1',
    emoji: '🔑',
    lines: [
      { de: 'Gestern habe ich meinen Schlüssel verloren.', en: 'Yesterday I lost my key.' },
      { de: 'Ich habe überall gesucht, aber ich konnte ihn nicht finden.', en: 'I searched everywhere, but I couldn’t find it.' },
      { de: 'Meine Nachbarin hat mir geholfen.', en: 'My neighbor helped me.' },
      { de: 'Zusammen haben wir den Garten und die Straße kontrolliert.', en: 'Together we checked the garden and the street.' },
      { de: 'Endlich lag der Schlüssel unter dem Auto.', en: 'Finally the key was lying under the car.' },
      { de: 'Ich war sehr erleichtert.', en: 'I was very relieved.' },
    ],
  },
  {
    id: 'neue-stadt',
    title: 'Umzug in eine neue Stadt',
    titleEn: 'Moving to a New City',
    level: 'B1',
    emoji: '📦',
    lines: [
      { de: 'Vor einem Monat bin ich in eine neue Stadt gezogen.', en: 'A month ago I moved to a new city.' },
      { de: 'Am Anfang kannte ich niemanden hier.', en: 'At the beginning I didn’t know anyone here.' },
      { de: 'Die ersten Tage waren ziemlich einsam.', en: 'The first days were quite lonely.' },
      { de: 'Dann habe ich einen Sprachkurs besucht.', en: 'Then I attended a language course.' },
      { de: 'Dort habe ich nette Leute kennengelernt.', en: 'There I met nice people.' },
      { de: 'Jetzt fühle ich mich viel wohler.', en: 'Now I feel much more comfortable.' },
    ],
  },
];
