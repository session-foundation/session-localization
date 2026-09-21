import {
  crowdinLocales,
  isCrowdinLocale,
  rtlLocales,
  type CrowdinLocale,
} from './generated/constants';
import {
  languageNames,
  languageNamesInEnglish,
  languageTerritories,
} from './generated/languages';

/** Shown where a language has no country. An answer, not a missing one. */
export const NO_FLAG = '🌐';

/**
 * Which flag a language gets, where the country CLDR names for it is the wrong answer.
 *
 * A flag belongs to a country and a language does not, so rows share flags and a few of those
 * pairings are contentious. An entry wins over the generated country; `null` means the globe.
 */
const FLAG_OVERRIDES: Partial<Record<CrowdinLocale, string | null>> = {};

/**
 * Where CLDR's name for a language is the wrong name to show, or the wrong word for this list.
 *
 * Presentation only. A code whose catalogue is written in some other language than the code says
 * is corrected where the data is generated, so that its flag and its text direction follow too.
 */
const NAME_OVERRIDES: Partial<Record<CrowdinLocale, { name: string; english: string }>> = {};

/**
 * A country code as its flag emoji.
 *
 * The two letters map onto the regional indicator symbols at U+1F1E6, which a font draws as a
 * flag when it recognises the pair.
 */
function flagFor(country: string): string {
  return String.fromCodePoint(
    ...[...country.toUpperCase()].map(letter => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
}

export function languageFlag(locale: CrowdinLocale): string {
  const country =
    locale in FLAG_OVERRIDES ? FLAG_OVERRIDES[locale] : languageTerritories[locale];
  return country === null || country === undefined ? NO_FLAG : flagFor(country);
}

/** The locale's own name for itself, falling back to the code so a row is never blank. */
export function languageName(locale: CrowdinLocale): string {
  return NAME_OVERRIDES[locale]?.name ?? languageNames[locale] ?? locale;
}

/**
 * The locale's name in English, where that is a different word from its own name.
 *
 * Null rather than a repeat of the name. Nothing draws this: it is there so somebody looking at
 * an interface in a script they cannot read can still find their language by searching for the
 * name they know.
 */
export function languageNameInEnglish(locale: CrowdinLocale): string | null {
  return NAME_OVERRIDES[locale]?.english ?? languageNamesInEnglish[locale] ?? null;
}

/**
 * Whether the layout mirrors for this locale.
 *
 * The whole layout, not the text: which way a back chevron points and which edge a trailing slot
 * sits on. Text direction is the renderer's own business and it handles it per run.
 */
export function isRtlLocale(locale: CrowdinLocale): boolean {
  return rtlLocales.includes(locale);
}

export interface LanguageOption {
  locale: CrowdinLocale;
  /** The language's name in that language, which is what the row reads. */
  name: string;
  /** Its name in English, where that is a different word. Searched, never drawn. */
  english: string | null;
  flag: string;
}

/**
 * Every language the catalogue carries, ordered for a picker.
 *
 * Sorted by the name as written rather than by code, with the reader's own collation rather than
 * a fixed one: the list mixes scripts and no single collation is right for all of them.
 */
export const languageOptions: readonly LanguageOption[] = [...crowdinLocales]
  .map(locale => ({
    locale,
    name: languageName(locale),
    english: languageNameInEnglish(locale),
    flag: languageFlag(locale),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Which region's catalogue a script stands for.
 *
 * The catalogue names Chinese by region and every platform reports it by script, so `zh-Hans` and
 * `zh-CN` are the same language written two ways and nothing in the tag says so.
 */
const SCRIPT_TO_LOCALE: Record<string, CrowdinLocale> = {
  'zh-hans': 'zh-CN',
  'zh-hant': 'zh-TW',
};

/**
 * The best match for a language tag the device reported, or null when nothing matches.
 *
 * Truncated one subtag at a time, as BCP-47 says to: `pt-BR` finds Brazilian Portuguese rather
 * than falling through to European, and `zh-Hans-AU` reaches `zh-Hans` and then the table above.
 * There is no bare `zh` to fall back to, so without that step Chinese matches nothing at all.
 *
 * Last, a language with exactly one shipped variant matches it, so bare `hy` finds `hy-AM`. Only
 * when there is exactly one: bare `pt` could be either Portuguese.
 *
 * Null rather than English, because the caller knows what an unsupported system language should
 * do and this does not.
 */
export function matchLocale(tag: string): CrowdinLocale | null {
  const subtags = tag.split('-');
  for (let length = subtags.length; length > 0; length -= 1) {
    const candidate = subtags.slice(0, length).join('-');
    if (isCrowdinLocale(candidate)) {
      return candidate;
    }
    const byScript = SCRIPT_TO_LOCALE[candidate.toLowerCase()];
    if (byScript !== undefined) {
      return byScript;
    }
  }

  const base = `${subtags[0]}-`.toLowerCase();
  const variants = crowdinLocales.filter(locale => locale.toLowerCase().startsWith(base));
  return variants.length === 1 ? variants[0] : null;
}
