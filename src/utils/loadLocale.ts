import { Locale } from "date-fns";

type LocaleImportFunction = () => Promise<{ default: Locale }>;

const localeImports: Record<string, LocaleImportFunction> = {
  "en-US": () =>
    import("date-fns/locale/en-US").then((m) => ({
      default: m.default as unknown as Locale,
    })),
  de: () =>
    import("date-fns/locale/de").then((m) => ({
      default: m.default as unknown as Locale,
    })),
  it: () =>
    import("date-fns/locale/it").then((m) => ({
      default: m.default as unknown as Locale,
    })),
  sv: () =>
    import("date-fns/locale/sv").then((m) => ({
      default: m.default as unknown as Locale,
    })),
};

export async function loadLocale(locale: string): Promise<Locale> {
  const importFunction = localeImports[locale];

  if (importFunction) {
    const module = await importFunction();
    return module.default;
  }

  console.warn(`Locale '${locale}' not found. Falling back to 'en-US'.`);
  return (await localeImports["en-US"]()).default;
}
