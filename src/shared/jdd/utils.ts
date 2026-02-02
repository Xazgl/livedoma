const yandexKeywords = [
  "{tol_ko_sip}",
  "tol_ko_sip",
  "105469680",
  "{mk}",
  "mk",
  "{мкстроительство}",
  "мкстроительство",
  "{мкстроительство2}",
  "{stroy}",
  "stroy",
  "{мск}",
  "мск",
  "{ep}",
  "ep",
  "{stroye}",
  "stroye",
  "{stroyE}",
  "stroyE",
  "{3sx}",
  "3sx",
  "{мкдевелопмент}",
  "мкдевелопмент",
  "Poisk_SIP",
  "{re}",
  "re",
  "{msk}",
  "msk",
  "{МКСстроительство}",
  "МКСстроительство",
  "{МКСтроительство}",
  "{МКСтроительство2}",
  "{МКстроительство2}",
  "{ESP}",
  'dom_zg',
  'mk_dom',
];

const rassulkaUtm = ["Rassulka", "rassulka"];
const sberUtm = ["rollap", "{rollap}"];
const website = ["sayt_gd", "Spasibo_JD", "sayt_gd"];
const avito =['stroy_sip', 'dom_nedviz','dom_zg','ruch_zg','ruch_nedviz']

function yandexOrAvitoByUtmCampaignJdd(utm_campaign: string | null) {
  if (utm_campaign) {
    const campaign = utm_campaign.toLowerCase();
    if (avito.some((keyword) => campaign.includes(keyword.toLowerCase()))) {
      return "Авито таргет";
    } else if (
      yandexKeywords.some((keyword) => campaign.includes(keyword.toLowerCase()))
    ) {
      return "Яндекс директ";
    } else if (
      rassulkaUtm.some((keyword) => campaign.includes(keyword.toLowerCase()))
    ) {
      return "Рассылка";
    } else if (campaign.includes("KP_JDD") || campaign.includes("kp_jdd")) {
      return "Коммерческое предложение";
    } else if (
      website.some((keyword) => campaign.includes(keyword.toLowerCase()))
    ) {
      return "Сайт Живем Дома";
    } else if (
      sberUtm.some((keyword) => campaign.includes(keyword.toLowerCase()))
    ) {
      return "Сбербанк";
    } else if (campaign.includes("buklet")) {
      return "Буклеты";
    } else {
      return null;
    }
  } else {
    return null;
  }
}

/**
 * Универсальная функция определения источника для ЖДД
 * @param utm_campaign - UTM метка campaign
 * @param utm_source - UTM метка source
 * @param utm_content - UTM метка content
 * @param utm_term - UTM метка term
 * @returns Источник трафика
 */
export function getSourceForJDDByUtm(
  utm_campaign: string | null,
  utm_source: string | null,
  utm_content: string | null,
  utm_term: string | null
):
  | "Яндекс директ"
  | "Авито таргет"
  | "Сайт Живем Дома"
  | "лендинг"
  | "Наш сайт"
  | "Рассылка"
  | "Коммерческое предложение"
  | "Сбербанк"
  | "Буклеты"
  | "Сайт Живем Дома" {
  const campaignSource = yandexOrAvitoByUtmCampaignJdd(utm_campaign);
  if (utm_source === "yandex") {
    return "Яндекс директ";
  }
  if (utm_source === "avito") {
    return "Авито таргет";
  }
  if (utm_source === "rassulka" || utm_source === "Rassulka") {
    return "Рассылка";
  }
  if (website.some((keyword) => utm_source?.includes(keyword.toLowerCase()))) {
    return "Сайт Живем Дома";
  }
  if (utm_source?.includes("buklet")) {
    return "Буклеты";
  }

  if (campaignSource) {
    return campaignSource;
  }

  return utm_source == "sayt_GD"
    ? "Сайт Живем Дома"
    : utm_source == "vk" || utm_source == "TG"
    ? "Наш сайт"
    : utm_campaign || utm_content || utm_term || utm_source
    ? "лендинг"
    : "Наш сайт";
}

/**
 * Универсальная функция определения источника для ЖДД в отчетах
 * @param sourceUtm - UTM метка source
 * @param campaignUtm - UTM метка campaign
 * @param termUtm - UTM метка term
 * @param translator - Источник из црм
 * @returns Источник трафика
 */
export function getTranslatorJdd(
  sourceUtm?: string | null,
  campaignUtm?: string | null,
  termUtm?: string | null,
  translator?: string | null
): string {
  if (sourceUtm === "yandex") {
    return "Яндекс директ";
  }
  if (sourceUtm === "avito") {
    return "Авито таргет";
  }
  if (sourceUtm === "rassulka" || sourceUtm === "Rassulka") {
    return "Рассылка";
  }
  if (website.some((keyword) => sourceUtm?.includes(keyword.toLowerCase()))) {
    return "Сайт Живем Дома";
  }
  if (campaignUtm == "(none)" || termUtm == "(none)") {
    return "Наш сайт";
  }
  if (campaignUtm) {
    const campaignSource = yandexOrAvitoByUtmCampaignJdd(campaignUtm);
    if (campaignSource) {
      return campaignSource;
    }
  }
  if (
    translator &&
    translator !== "WhatsApp" &&
    translator !== "Авито" &&
    translator !== "ДомКлик" &&
    translator !== "Яндекс Услуги" &&
    translator !== "Циан" &&
    translator !== "рекомендация" &&
    translator !== "Сбербанк" &&
    translator !== "Вконтакте" &&
    translator !== "Буклеты" &&
    translator !== "таблички у домов" &&
    translator !== "Вконтакте реклама"
  ) {
    if (sourceUtm == "TG" || sourceUtm == "vk" || sourceUtm == "sayt_GD") {
      return "Наш сайт";
    } else {
      return (sourceUtm && sourceUtm !== "нету") ||
        (campaignUtm && campaignUtm !== "нету") ||
        (termUtm && termUtm !== "нету")
        ? "лендинг"
        : "Наш сайт";
    }
  }
  return translator ?? "";
}
