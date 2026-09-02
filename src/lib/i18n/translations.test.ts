import { describe, expect, it } from "vitest";
import { LOCALES, translations } from "./translations";

describe("translations", () => {
  it("defines every supported locale", () => {
    expect(LOCALES.map((l) => l.code).sort()).toEqual(["de", "en", "fr", "nl"]);
  });

  it("has the same set of keys across all locales", () => {
    const [firstLocale, ...rest] = LOCALES.map((l) => l.code);
    const referenceKeys = Object.keys(translations[firstLocale]).sort();

    for (const locale of rest) {
      expect(Object.keys(translations[locale]).sort()).toEqual(referenceKeys);
    }
  });
});
