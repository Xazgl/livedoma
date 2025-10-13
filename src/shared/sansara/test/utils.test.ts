import { describe, expect, it } from "vitest";
import { SansaraSource } from "../../../../@types/dto";
import { getSourceForSansaraByUtm } from "../utils";

describe("getSourceForSansaraByUtm", () => {
  it("возвращает 'Сайт Сансара', когда все UTM пустые", () => {
    expect(
      getSourceForSansaraByUtm(null, null, null, null)
    ).toBe<SansaraSource>("Сайт Сансара");

    expect(
      getSourceForSansaraByUtm("(none)", "(none)", "(none)", "(none)")
    ).toBe<SansaraSource>("Сайт Сансара");

    expect(
      getSourceForSansaraByUtm("нету", "нету", "нету", "нету")
    ).toBe<SansaraSource>("Сайт Сансара");
  });

  it("TG в source -> 'Telegram Сансара'", () => {
    expect(
      getSourceForSansaraByUtm(null, "tg", null, null)
    ).toBe<SansaraSource>("Telegram Сансара");

    expect(
      getSourceForSansaraByUtm("something", "tg", "x", "y")
    ).toBe<SansaraSource>("Telegram Сансара");
  });

  it("vk в source -> 'Сайт Сансара'", () => {
    expect(
      getSourceForSansaraByUtm(null, "vk", null, null)
    ).toBe<SansaraSource>("Сайт Сансара");
  });

  it("source содержит cian -> 'Реклама ЦИАН Сансара'", () => {
    expect(
      getSourceForSansaraByUtm(null, "cian", null, null)
    ).toBe<SansaraSource>("Реклама ЦИАН Сансара");

    expect(
      getSourceForSansaraByUtm(null, "cian2", null, null)
    ).toBe<SansaraSource>("Реклама ЦИАН Сансара");

    expect(
      getSourceForSansaraByUtm(null, "my-cian-source", null, null)
    ).toBe<SansaraSource>("Реклама ЦИАН Сансара");
  });

  it("yandex|avito + (campaign,content,term) пустые -> 'Сайт Сансара'", () => {
    expect(
      getSourceForSansaraByUtm("(none)", "yandex", "(none)", "(none)")
    ).toBe<SansaraSource>("Сайт Сансара");

    expect(
      getSourceForSansaraByUtm("нету", "avito", "нету", "нету")
    ).toBe<SansaraSource>("Сайт Сансара");
  });

  it("кампания из avitoUtmCampaigns (nedviz/new_build) -> 'Авито таргет' (fallback по кампании)", () => {
    expect(
      getSourceForSansaraByUtm("nedviz", "other", null, null)
    ).toBe<SansaraSource>("Авито таргет");

    expect(
      getSourceForSansaraByUtm("new_build", "something", "x", "y")
    ).toBe<SansaraSource>("Авито таргет");
  });

  it("кампания из yandexUtmCampaigns -> 'Яндекс директ' (текущая реализация)", () => {
    expect(
      getSourceForSansaraByUtm("mk-all-oct", "yandex", "x", "y")
    ).toBe<SansaraSource>("Яндекс директ");

    expect(
      getSourceForSansaraByUtm("{SEPKR}", "yandex", null, "term")
    ).toBe<SansaraSource>("Яндекс директ");

    expect(
      getSourceForSansaraByUtm("{EPKFIX}", "yandex", null, null)
    ).toBe<SansaraSource>("Яндекс директ");
  });

  it("кампания содержит tg -> 'Telegram Сансара'", () => {
    expect(
      getSourceForSansaraByUtm("tg-super-campaign", "yandex", "x", "y")
    ).toBe<SansaraSource>("Telegram Сансара");
  });

  it("кампания из cianUtmCampaigns -> 'Реклама ЦИАН Сансара'", () => {
    expect(
      getSourceForSansaraByUtm("cian", "yandex", null, null)
    ).toBe<SansaraSource>("Реклама ЦИАН Сансара");
    expect(
      getSourceForSansaraByUtm("cian2", "other", null, null)
    ).toBe<SansaraSource>("Реклама ЦИАН Сансара");
  });

  it("fallback: есть какие-то UTM, но не сработал ни один из детекторов -> 'Лендинг Сансара'", () => {
    expect(
      getSourceForSansaraByUtm("some-campaign", "unknown", null, null)
    ).toBe<SansaraSource>("Лендинг Сансара");

    expect(
      getSourceForSansaraByUtm(null, "something", "abc", null)
    ).toBe<SansaraSource>("Лендинг Сансара");
  });

  it("если вообще нет UTM (или все '(none)'/ 'нету'/пусто) -> 'Сайт Сансара'", () => {
    expect(getSourceForSansaraByUtm("", "", "", "")).toBe<SansaraSource>(
      "Сайт Сансара"
    );
  });
});
