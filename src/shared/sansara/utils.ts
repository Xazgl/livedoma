import { SansaraSource } from "../../../@types/dto";
import {
  avitoUtmCampaigns,
  cianUtmCampaigns,
  yandexUtmCampaigns,
} from "./constant";

/**
 * Функция для проверки пустого значения
 */
const isEmptyValue = (value: string | null) => {
  return (
    !value || value === "(none)" || value === "нету" || value.trim() === ""
  );
};

/**
 * Функция для проверки пустый utm
 */
const isEmptyUtm = (
  utm_campaign: string | null,
  utm_source: string | null,
  utm_content: string | null,
  utm_term: string | null
) => {
  return (
    isEmptyValue(utm_source) &&
    isEmptyValue(utm_campaign) &&
    isEmptyValue(utm_content) &&
    isEmptyValue(utm_term)
  );
};

/**
 * Функция определения источника по utm_campaign
 * @param utmArr - массив utm меток источника
 * @param utm - текущая метка по которой будет искать совпадение
 * @returns  boolean
 */
const findUtm = (utmArr: string[], utm: string) => {
  return utmArr.some((utmItem) => utm.includes(utmItem.toLowerCase()));
};

/**
 * Функция определения источника по utm_campaign
 * @param utm_campaign - UTM метка campaign
 * @returns Источник трафика
 */
function yandexOrAvitoByUtmCampaign(utm_campaign: string | null) {
  if (utm_campaign) {
    const campaign = utm_campaign.toLowerCase();
    if (findUtm(avitoUtmCampaigns, campaign)) {
      return "Авито таргет";
    } else if (findUtm(yandexUtmCampaigns, campaign)) {
      return "Яндекс директ";
    } else if (campaign.includes("tg")) {
      return "Telegram Сансара";
    } else if (findUtm(cianUtmCampaigns, campaign)) {
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
): SansaraSource {
  //Если меток нету
  if (isEmptyUtm(utm_campaign, utm_source, utm_content, utm_term)) {
    return "Сайт Сансара";
  }
  if (utm_source?.toLowerCase() === "tg") {
    return "Telegram Сансара";
  }

  if (utm_source?.toLowerCase() === "vk") {
    return "Сайт Сансара";
  }

  if (utm_source?.toLowerCase().includes("cian")) {
    return "Реклама ЦИАН Сансара";
  }

  if (
    isEmptyValue(utm_campaign) &&
    isEmptyValue(utm_content) &&
    isEmptyValue(utm_term)
  ) {
    return "Сайт Сансара";
  } else {
    if (utm_campaign) {
      const campaignSource = yandexOrAvitoByUtmCampaign(utm_campaign);
      if (campaignSource) {
        return campaignSource;
      }
    }
  }

  return utm_campaign || utm_content || utm_term || utm_source
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
