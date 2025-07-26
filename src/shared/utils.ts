/**
 * Возвращает значение, соответствующее теме (тёмной или светлой).
 * @param {string} theme - Текущая тема, например "dark" или "light".
 * @param {string} darkValue - Значение, которое нужно вернуть для тёмной темы.
 * @param {string} lightValue - Значение, которое нужно вернуть для светлой темы.
 * @returns {string} - Значение, соответствующее текущей теме.
 */
export function checkTheme(
  theme: string,
  darkValue: string,
  lightValue: string
) {
  return theme === "dark" ? darkValue : lightValue;
}

/**
 * Проверяет формат изображения
 * @param {string} url - Текущая ссылка на изображение
 */
export const isImage = (url: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
  const urlWithoutParams = url.split("?")[0]; // Убираем параметры из URL
  return imageExtensions.some((ext) =>
    urlWithoutParams.toLowerCase().endsWith(ext)
  );
};

/**
 * Функция проверяет UTM-метку campaign и возвращает источник трафика
 * @param utmCampaign - Значение UTM-метки campaign
 * @returns 'Яндекс Директ' | 'Авито Таргет' | undefined
 */
export function getSourceForSansaraByUtm(
  utmCampaign: string
): "Яндекс Директ" | "Авито Таргет" | undefined {
  const campaign = utmCampaign.toLowerCase();

  if (
    campaign.includes("mk-all-oct") ||
    campaign.includes("transh") ||
    campaign.includes("{mk-all-nov}")
  ) {
    return "Яндекс Директ";
  }

  if (campaign.includes("nedviz") || campaign.includes("new_build")) {
    return "Авито Таргет";
  }

  return undefined;
}

/**
 * Определяет источник трафика для ЖДД по UTM-метке campaign
 * @param utmCampaign - Значение UTM-метки campaign
 * @returns 'Яндекс Директ' | 'Авито Таргет' | undefined
 */
export function getSourceForJDDByUtm(
  utmCampaign: string
): "Яндекс Директ" | "Авито Таргет" | undefined {
  const campaign = utmCampaign.toLowerCase();

  if (campaign.includes("ruch_zg") || campaign.includes("ruch_nedviz")) {
    return "Авито Таргет";
  }

  if (
    campaign.includes("{tol_ko_sip}") ||
    campaign.includes("105469680") ||
    campaign.includes("{mk}") ||
    campaign.includes("{мкстроительство}") ||
    campaign.includes("{stroy}") ||
    campaign.includes("{мск}") ||
    campaign.includes("{ep}") ||
    campaign.includes("{stroye}") ||
    campaign.includes("{3sx}") ||
    campaign.includes("{мкдевелопмент}")
  ) {
    return "Яндекс Директ";
  }

  return undefined;
}
