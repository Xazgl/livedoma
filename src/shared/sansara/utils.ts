function yandexOrAvitoByUtmCampaign(utm_campaign: string | null) {
  if (utm_campaign) {
    const campaign = utm_campaign.toLowerCase();
    if (campaign.includes("nedviz") || campaign.includes("new_build")) {
      return "Авито таргет";
    } else if (
      campaign.includes("mk-all-oct") ||
      campaign.includes("{mk-all-oct}") ||
      campaign.includes("transh") ||
      campaign.includes("{transh}") ||
      campaign.includes("{mk-all-nov}") ||
      campaign.includes("{SEPK}") ||
      campaign.includes("{sepk}") ||
      campaign.includes("mk-all") ||
      campaign.includes("{mk-all-test}") ||
      campaign.includes("{PS}") ||
      campaign.includes("{ps}") || 
      campaign.includes("{EPKFIX}") || 
      campaign.includes("{EPKklick}") 
    ) {
      return "Яндекс директ";
    } else if (campaign.includes("tg")) {
      return "Telegram Сансара";
    } else if (
      campaign.includes("cian") ||
      campaign.includes("cian1") ||
      campaign.includes("cian2")
    ) {
      return "Реклама ЦИАН Сансара";
    } else {
      return null;
    }
  } else {
    return null;
  }
}

/**
 * Универсальная функция определения источника для Сансары
 * @param utm_campaign - UTM метка campaign
 * @param utm_source - UTM метка source
 * @param utm_content - UTM метка content
 * @param utm_term - UTM метка term
 * @returns Источник трафика
 */
export function getSourceForSansaraByUtm(
  utm_campaign: string | null,
  utm_source: string | null,
  utm_content: string | null,
  utm_term: string | null
):
  | "Яндекс директ"
  | "Авито таргет"
  | "Сайт Сансара"
  | "Лендинг Сансара"
  | "Telegram Сансара"
  | "Реклама ЦИАН Сансара" {
  if (utm_campaign == "(none)" || utm_term == "(none)") {
    return "Сайт Сансара";
  }
  if (utm_source === "yandex") {
    return "Яндекс директ";
  }
  if (utm_source === "avito") {
    return "Авито таргет";
  }
  if (utm_campaign) {
    const campaignSource = yandexOrAvitoByUtmCampaign(utm_campaign);
    if (campaignSource) {
      return campaignSource;
    }
  }

  return utm_source == "vk" || utm_source == "TG"
    ? "Сайт Сансара"
    : utm_campaign || utm_content || utm_term || utm_source
    ? "Лендинг Сансара"
    : "Сайт Сансара";
}

/**
 * Универсальная функция определения источника для Сансары в отчетах
 * @param sourceUtm - UTM метка source
 * @param campaignUtm - UTM метка campaign
 * @param termUtm - UTM метка term
 * @param translator - Источник из црм
 * @returns Источник трафика
 */
export function getTranslatorSansaraNew(
  sourceUtm?: string | null,
  campaignUtm?: string | null,
  termUtm?: string | null,
  translator?: string | null
): string {
  if (translator?.toLowerCase().includes("билборд")) {
    return translator;
  }
  if (campaignUtm == "(none)" || termUtm == "(none)") {
    return "Сайт Сансара";
  }
  if (sourceUtm === "yandex") {
    return "Яндекс директ";
  }
  if (sourceUtm === "avito") {
    return "Авито таргет";
  }
  if (campaignUtm) {
    const campaignSource = yandexOrAvitoByUtmCampaign(
      campaignUtm.toLowerCase()
    );
    if (campaignSource) {
      return campaignSource;
    }
  }
  if (
    translator &&
    translator !== "WhatsApp" &&
    translator !== "Avito" &&
    translator !== "Дом Клик" &&
    translator !== "yandex" &&
    translator !== "Циан" &&
    translator !== "VK" &&
    translator !== "Забор" &&
    translator !== "Telegram Сансара" &&
    translator !== "Мир квартир" &&
    translator !== "М2 ВТБ" &&
    translator !== "jivem-doma.ru" &&
    translator !== "Сайт Сансара"
  ) {
    if (sourceUtm == "TG" || sourceUtm == "vk") {
      return "Сайт Сансара";
    } else {
      return (sourceUtm && sourceUtm !== "нету") ||
        (campaignUtm && campaignUtm !== "нету") ||
        (termUtm && termUtm !== "нету")
        ? "Лендинг Сансара"
        : "Сайт Сансара";
    }
  }
  return translator ? translator : "";
}
