import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DOMParser, XMLSerializer } from 'xmldom';

/**
 * Забирает XML данные по указанному URL и парсит их в объект Document
 * @param url - URL для забора XML данных
 * @returns Promise<Document>
 */
const fetchXML = async (url: string): Promise<Document> => {
  const response = await axios.get(url);
  const text = response.data;
  return new DOMParser().parseFromString(text, "application/xml");
};

/**
 * Получает значение flat_id из элемента complex
 * @param complex - XML элемент complex
 * @returns string
 */
const getFlatIdFromComplex = (complex: Element): string => {
  const flatIdElement = complex.getElementsByTagName('flat_id')[0];
  return flatIdElement ? flatIdElement.textContent || '' : '';
};

/**
 * Получает значение internal-id из элемента offer
 * @param offer - XML элемент offer
 * @returns string
 */
const getInternalIdFromOffer = (offer: Element): string => {
  return offer.getAttribute('internal-id') || '';
};

/**
 * Заменяет изображения в элементе complex на изображения из элемента offer
 * @param complex - XML элемент complex
 * @param offer - XML элемент offer
 */
const replaceImages = (complex: Element, offer: Element): void => {
  const complexImages = complex.getElementsByTagName('image');
  const offerImages = offer.getElementsByTagName('image');

  for (let i = 0; i < complexImages.length; i++) {
    if (offerImages[i]) {
      complexImages[i].textContent = offerImages[i].textContent;
    }
  }
};

/**
 * Обрабатывает два XML фида и заменяет изображения
 * @param sourceFeedUrl - URL исходного фида
 * @param targetFeedUrl - URL целевого фида
 * @returns Promise<Document>
 */
const processFeeds = async (sourceFeedUrl: string, targetFeedUrl: string): Promise<Document> => {
  const sourceFeed = await fetchXML(sourceFeedUrl);
  const targetFeed = await fetchXML(targetFeedUrl);

  const complexes = sourceFeed.getElementsByTagName('complex');
  const offers = targetFeed.getElementsByTagName('offer');

  console.log(`Found ${complexes.length} complexes and ${offers.length} offers`);

  for (let i = 0; i < complexes.length; i++) {
    const complex = complexes[i];
    const flatId = getFlatIdFromComplex(complex);
    console.log(`Processing complex with flat_id: ${flatId}`);
    for (let j = 0; j < offers.length; j++) {
      const offer = offers[j];
      const internalId = getInternalIdFromOffer(offer);
      if (flatId === internalId) {
        console.log(`Match found: ${flatId} === ${internalId}`);
        replaceImages(complex, offer);
      }
    }
  }

  return sourceFeed;
};

/**
 * Преобразует XML документ в HTML строку
 * @param xmlDoc - XML документ
 * @returns string
 */
const xmlToHtml = (xmlDoc: Document): string => {
  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(xmlDoc);
  return `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <style id="xml-viewer-style">
        /* Your CSS styles here */
        :root { color-scheme: light dark; }
        div.header { border-bottom: 2px solid black; padding-bottom: 5px; margin: 10px; }
        @media (prefers-color-scheme: dark) { div.header { border-bottom: 2px solid white; } }
        div.folder > div.hidden { display: none; }
        div.folder > span.hidden { display: none; }
        .pretty-print { margin-top: 1em; margin-left: 20px; font-family: monospace; font-size: 13px; }
        #webkit-xml-viewer-source-xml { display: none; }
        .opened { margin-left: 1em; }
        .comment { white-space: pre; }
        .folder-button { user-select: none; cursor: pointer; display: inline-block; margin-left: -10px; width: 10px; background-repeat: no-repeat; background-position: left top; vertical-align: bottom; }
        .fold { background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' fill='%23909090' width='10' height='10'><path d='M0 0 L8 0 L4 7 Z'/></svg>"); height: 10px; }
        .open { background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' fill='%23909090' width='10' height='10'><path d='M0 0 L0 8 L7 4 Z'/></svg>"); height: 10px; }
      </style>
    </head>
    <body>
      <div class="header"><span>This XML file does not appear to have any style information associated with it. The document tree is shown below.</span><br /></div>
      <div id="webkit-xml-viewer-source-xml">${xmlString}</div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          function toggleVisibility(event) {
            const button = event.target;
            const nextElement = button.nextElementSibling;
            if (nextElement && nextElement.classList.contains('folder')) {
              nextElement.classList.toggle('hidden');
              button.classList.toggle('open');
              button.classList.toggle('fold');
            }
          }
          
          const buttons = document.querySelectorAll('.folder-button');
          buttons.forEach(button => button.addEventListener('click', toggleVisibility));
        });
      </script>
    </body>
    </html>
  `;
};

export async function POST(req: NextRequest) {
  const sourceFeedUrl = 'https://mlscenter.ru/xml/converter/feeds/ba7cf8539e56ed688ce1510391a40f9a.xml';
  const targetFeedUrl = 'http://mlscenter.ru/xml/converter/feeds/80c7e2bbd8e77697f06a5777ae53b18f.xml';

  try {
    const updatedXMLDoc = await processFeeds(sourceFeedUrl, targetFeedUrl);
    const updatedHTML = xmlToHtml(updatedXMLDoc);
    return new NextResponse(updatedHTML, { status: 200, headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    console.error('Error processing feeds:', error);
    return NextResponse.json({ error: 'Error processing feeds' }, { status: 500 });
  }
}
