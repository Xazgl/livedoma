// // yandex-dump-all.js
// require('dotenv').config();
// const { ImapFlow } = require('imapflow');
// const { simpleParser } = require('mailparser');

// const IMAP_HOST    =    'imap.yandex.ru';
// const IMAP_PORT    = Number(993);
// const IMAP_USER    =  'info@jivem-doma.ru';
// const IMAP_PASS    =  'deeisapgcdefhnnf';
// const IMAP_MAILBOX =  'VK заявки в кабинета ads';

// // если хотите ограничить кол-во последних сообщений — укажите LAST_N (>0)
// const LAST_N       = Number(process.env.LAST_N || 0);

// // TRUE = печатать ПОЛНЫЙ html/текст письма; FALSE = обрезать до 2000 символов
// const FULL_BODIES  = (process.env.FULL_BODIES || 'true') !== 'false';

// (async () => {
//   const client = new ImapFlow({ /* ... */ });

//   try {
//     console.log(`→ Подключаюсь к ${IMAP_HOST}:${IMAP_PORT} как ${IMAP_USER}`);
//     await client.connect();

//     const lock = await client.getMailboxLock(IMAP_MAILBOX);
//     try {
//       // 1) найдём UID непрочитанных (UNSEEN) писем в этой папке
//       const uids = await client.search({ seen: false });   // <— ключевая строка
//       // альтернативно: const uids = await client.search({ not: { seen: true } });

//       if (!uids.length) {
//         console.log('[]'); // нет непрочитанных
//         return;
//       }

//       const out = [];

//       // 2) по найденным UID забираем содержимое
//       for await (const msg of client.fetch(uids, {
//         source: true,
//         flags: true,
//         envelope: true,
//         internalDate: true,
//         size: true
//       })) {
//         // (опционально) дополнительная страховка на стороне клиента:
//         // если вдруг другой клиент успел поставить \Seen между search и fetch
//         if (msg.flags?.has('\\Seen')) continue;

//         // дальше — ваш текущий парсинг и сбор JSON
//         let parsed = null;
//         try { parsed = await simpleParser(msg.source); } catch {}
//         const headersObj = {};
//         if (parsed?.headers) for (const [k, v] of parsed.headers) headersObj[k] = Array.isArray(v) ? v : String(v);

//         const addrList = (addr) => (addr?.value || []).map(a => ({ name: a.name || null, address: a.address || null }));
//         const textBody = parsed?.text || '';
//         const htmlBody = typeof parsed?.html === 'string' ? parsed.html : '';
//         const trimmed = (s) => s;

//         const attachments = (parsed?.attachments || []).map(a => ({
//           filename: a.filename || null,
//           contentType: a.contentType || null,
//           size: a.size || null,
//           checksum: a.checksum || null,
//           contentId: a.cid || null,
//           partId: a.partId || null,
//           related: !!a.related
//         }));

//         out.push({
//           uid: msg.uid,
//           seq: msg.seq,
//           flags: [...(msg.flags || [])],
//           internalDate: msg.internalDate ? new Date(msg.internalDate).toISOString() : null,
//           size: msg.size ?? null,
//           envelope: {
//             date: msg.envelope?.date ? new Date(msg.envelope.date).toISOString() : null,
//             subject: msg.envelope?.subject || null,
//             messageId: msg.envelope?.messageId || null,
//             inReplyTo: msg.envelope?.inReplyTo || null,
//             references: msg.envelope?.references || null,
//             from: addrList({ value: msg.envelope?.from }),
//             sender: addrList({ value: msg.envelope?.sender }),
//             replyTo: addrList({ value: msg.envelope?.replyTo }),
//             to: addrList({ value: msg.envelope?.to }),
//             cc: addrList({ value: msg.envelope?.cc }),
//             bcc: addrList({ value: msg.envelope?.bcc })
//           },
//           parsed: parsed ? {
//             subject: parsed.subject || null,
//             messageId: parsed.messageId || null,
//             date: parsed.date ? parsed.date.toISOString() : null,
//             from: addrList(parsed.from),
//             to: addrList(parsed.to),
//             cc: addrList(parsed.cc),
//             bcc: addrList(parsed.bcc),
//             headers: headersObj,
//             text: trimmed(textBody),
//             html: trimmed(htmlBody),
//             attachments
//           } : null,
//           sourceLength: msg?.source ? Buffer.byteLength(msg.source) : null
//         });
//       }

//       console.log(JSON.stringify(out, null, 2));
//     } finally {
//       lock.release();
//     }

//     await client.logout();
//   } catch (e) {
//     console.error('Ошибка:', e?.message || e);
//     try { await client.logout(); } catch {}
//     process.exit(1);
//   }
// })();


// yandex-unseen-only.js
require('dotenv').config();
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

const IMAP_HOST    = 'imap.yandex.ru';
const IMAP_PORT    = 993;
const IMAP_USER    = 'info@jivem-doma.ru';
const IMAP_PASS    = 'deeisapgcdefhnnf';
const IMAP_MAILBOX = 'VK заявки в кабинета ads';

// Если нужно ограничить количество последних писем — укажи LAST_N (>0) в .env
const LAST_N = Number(process.env.LAST_N || 0);

// Удобная печать одной строкой (NDJSON), чтобы ничего не "обрезалось" в консоли
function print(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

(async () => {
  const client = new ImapFlow({
    host: IMAP_HOST,
    port: IMAP_PORT,
    secure: true,
    auth: { user: IMAP_USER, pass: IMAP_PASS },
    logger: false
  });

  try {
    console.log(`→ Подключаюсь к ${IMAP_HOST}:${IMAP_PORT} как ${IMAP_USER}`);
    await client.connect();

    // Заблокируем нужный ящик
    const lock = await client.getMailboxLock(IMAP_MAILBOX);
    try {
      // Для информации: статус папки
      const st = await client.status(IMAP_MAILBOX, { messages: true, unseen: true, recent: true });
      console.log(`Папка "${IMAP_MAILBOX}": messages=${st.messages} unseen=${st.unseen} recent=${st.recent}`);

      // Ищем только непрочитанные (SEARCH UNSEEN)
      let uids = await client.search({ seen: false });

      if (!uids.length) {
        // Явно показываем, что непрочитанных нет
        console.log('[]');
        return;
      }

      // Опционально ограничим последние N по UID (UID растут со временем)
      if (LAST_N > 0 && uids.length > LAST_N) {
        uids = [...uids].sort((a, b) => a - b).slice(-LAST_N);
      }

      // Фетчим письма; берём исходник для полного парсинга
      for await (const msg of client.fetch(uids, {
        source: true,
        flags: true,
        envelope: true,
        internalDate: true,
        size: true,
        bodyStructure: true
      })) {
        // Доп. страховка: если между search и fetch флаг \Seen уже поставили — пропустим
        if (msg.flags?.has('\\Seen')) continue;

        // Парс тела/заголовков
        let parsed = null;
        try {
          parsed = await simpleParser(msg.source);
        } catch (_) {
          // игнорим ошибки парсинга, но всё равно выведем метаданные
        }

        // Сложим заголовки в объект
        const headersObj = {};
        if (parsed?.headers) {
          for (const [k, v] of parsed.headers) {
            headersObj[k] = Array.isArray(v) ? v : String(v);
          }
        }

        const addrList = (addr) =>
          (addr?.value || []).map(a => ({
            name: a.name || null,
            address: a.address || null
          }));

        // Вложения — метаданные
        const attachments = (parsed?.attachments || []).map(a => ({
          filename: a.filename || null,
          contentType: a.contentType || null,
          size: a.size || null,
          checksum: a.checksum || null,
          contentId: a.cid || null,
          partId: a.partId || null,
          related: !!a.related
        }));

        // Собираем объект письма максимально «сырым» (никаких обрезаний)
        const out = {
          uid: msg.uid,
          seq: msg.seq,
          flags: [...(msg.flags || [])],        // здесь как раз видно, что \Seen отсутствует
          internalDate: msg.internalDate ? new Date(msg.internalDate).toISOString() : null,
          size: msg.size ?? null,
          envelope: {
            date: msg.envelope?.date ? new Date(msg.envelope.date).toISOString() : null,
            subject: msg.envelope?.subject || null,
            messageId: msg.envelope?.messageId || null,
            inReplyTo: msg.envelope?.inReplyTo || null,
            references: msg.envelope?.references || null,
            from: addrList({ value: msg.envelope?.from }),
            sender: addrList({ value: msg.envelope?.sender }),
            replyTo: addrList({ value: msg.envelope?.replyTo }),
            to: addrList({ value: msg.envelope?.to }),
            cc: addrList({ value: msg.envelope?.cc }),
            bcc: addrList({ value: msg.envelope?.bcc })
          },
          bodyStructure: msg.bodyStructure || null, // структура MIME от IMAP (полезна для анализа)
          parsed: parsed ? {
            subject: parsed.subject || null,
            messageId: parsed.messageId || null,
            date: parsed.date ? parsed.date.toISOString() : null,
            from: addrList(parsed.from),
            to: addrList(parsed.to),
            cc: addrList(parsed.cc),
            bcc: addrList(parsed.bcc),
            headers: headersObj,           // все заголовки
            text: parsed.text || '',       // полный текст
            html: typeof parsed.html === 'string' ? parsed.html : '', // полный html
            attachments
          } : null,
          sourceLength: msg?.source ? Buffer.byteLength(msg.source) : null
        };

        // Печатаем одной строкой — консоль не обрезает
        print(out);
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (e) {
    console.error('Ошибка:', e?.message || e);
    try { await client.logout(); } catch {}
    process.exit(1);
  }
})();

