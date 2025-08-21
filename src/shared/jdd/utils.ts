function yandexOrAvitoByUtmCampaignJdd(utm_campaign: string | null) {
  if (utm_campaign) {
    const campaign = utm_campaign.toLowerCase();
    const yandexKeywords = [
      "{tol_ko_sip}",
      "105469680",
      "{mk}",
      "{мкстроительство}",
      "{stroy}",
      "{мск}",
      "{ep}",
      "{stroye}",
      "{3sx}",
      "{мкдевелопмент}",
      "Poisk_SIP",
      "{re}",
      "{msk}",
      "{МКСстроительство}",
      "{ESP}",
    ];

    const rassulkaUtm = ["Rassulka", "rassulka"];
    const sberUtm = ["rollap", "{rollap}"];

    if (campaign.includes("ruch_zg") || campaign.includes("ruch_nedviz")) {
      return "Авито Таргет";
    } else if (yandexKeywords.some((keyword) => campaign.includes(keyword))) {
      return "Яндекс Директ";
    } else if (rassulkaUtm.some((keyword) => campaign.includes(keyword))) {
      return "Рассылка";
    } else if (campaign.includes("KP_JDD") || campaign.includes("kp_jdd")) {
      return "Коммерческое предложение";
    } else if (campaign.includes("sayt_gd")) {
      return "Наш сайт";
    } else if (sberUtm.includes("sayt_gd")) {
      return "Сбербанк";
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
  | "Яндекс Директ"
  | "Авито Таргет"
  | "Сайт Живем Дома"
  | "лендинг"
  | "Наш сайт"
  | "Рассылка"
  | "Коммерческое предложение"
  | "Сбербанк" {
  const campaignSource = yandexOrAvitoByUtmCampaignJdd(utm_campaign);
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
  if (campaignUtm) {
    const campaignSource = yandexOrAvitoByUtmCampaignJdd(campaignUtm);
    if (campaignSource) {
      return campaignSource;
    }
  }
  if (campaignUtm == "(none)" || termUtm == "(none)") {
    return "Наш сайт";
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
