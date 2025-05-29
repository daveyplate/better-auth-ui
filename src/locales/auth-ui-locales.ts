"use client"
import type { AuthLocalization } from "../lib/auth-localization"
import ar from "./jsons/ar.json"
import bg from "./jsons/bg.json"
import cs from "./jsons/cs.json"
import da from "./jsons/da.json"
import de from "./jsons/de.json"
import el from "./jsons/el.json"
import en from "./jsons/en.json"
import et from "./jsons/et.json"
import fi from "./jsons/fi.json"
import fr from "./jsons/fr.json"
import hu from "./jsons/hu.json"
import id from "./jsons/id.json"
import it from "./jsons/it.json"
import ja from "./jsons/ja.json"
import ko from "./jsons/ko.json"
import lt from "./jsons/lt.json"
import lv from "./jsons/lv.json"
import nb from "./jsons/nb.json"
import nl from "./jsons/nl.json"
import pl from "./jsons/pl.json"
import pt from "./jsons/pt.json"
import ro from "./jsons/ro.json"
import ru from "./jsons/ru.json"
import sk from "./jsons/sk.json"
import sl from "./jsons/sl.json"
import sv from "./jsons/sv.json"
import tr from "./jsons/tr.json"
import uk from "./jsons/uk.json"
import zh from "./jsons/zh.json"

function browserLocale(): string {
    return(navigator.language||navigator.languages[0]).split("-")[0]||"";
}

const locales = {
    ar, // Arabic
    bg, // Bulgarian
    cs, // Czech
    da, // Danish
    de, // German
    el, // Greek
    en, // English
    et, // Estonian
    fi, // Finnish
    fr, // French
    hu, // Hungarian
    id, // Indonesian
    it, // Italian
    ja, // Japanese
    ko, // Korean
    lt, // Lithuanian
    lv, // Latvian
    nb, // Norwegian Bokmål
    nl, // Dutch
    pl, // Polish
    pt, // Portuguese
    ro, // Romanian
    ru, // Russian
    sk, // Slovak
    sl, // Slovenian
    sv, // Swedish
    tr, // Turkish
    uk, // Ukrainian
    zh, // Chinese
} as const;

type LocaleKey = keyof typeof locales;

export const authUILocales: Record<LocaleKey, AuthLocalization> = locales;

function isValidLocale(locale: string): locale is LocaleKey {
    return locale in locales;
}

export function useBrowserLocale(): AuthLocalization {
    const locale = browserLocale();
    return isValidLocale(locale) ? authUILocales[locale] : authUILocales.en;
}

