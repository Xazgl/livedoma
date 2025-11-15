
require('dotenv').config();
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

const IMAP_HOST    = 'imap.yandex.ru';
const IMAP_PORT    = 993;
const IMAP_USER    = 'info@jivem-doma.ru';
const IMAP_PASS    = 'deeisapgcdefhnnf';
const IMAP_MAILBOX = 'VK заявки в кабинета ads';
const SENDER       = 'ads.notifications@vk.company';

const API_LOCAL    = 'http://localhost:3000/api/vk_jdd_for_mail';
const API_FALLBACK =  'https://mls-vlg.ru/api/vk_jdd_for_mail'
const VK_SECRET    = 'afe7eea1a58eb43414b91121fcab86d4312a42b4887172';

// порог по дате: всё, что НЕ НИЖЕ этой даты (>=)
const DATE_CUTOFF  = new Date('2025-11-09T00:00:00+03:00'); // МСК

// Сколько последних брать после фильтров (0 = все)
const LAST_N       = Number(process.env.LAST_N || 0);

// Помечать как прочитанные после успешной отправки
const MARK_AS_SEEN_ON_SUCCESS =
  process.env.MARK_AS_SEEN_ON_SUCCESS === 'false' ? false : true;

// fetch: глобальный (Node18+) или node-fetch по требованию
const fetch = (...args) =>
  (globalThis.fetch
    ? globalThis.fetch(...args)
    : import('node-fetch').then(m => m.default(...args))
  );

// ---------- helpers ----------
function parseFormName(subject = '') {
  const m = subject.match(/Новая заявка от формы:\s*(.+)$/i);
  return (m && m[1]) ? m[1].trim() : (subject || '');
}

function parseAnswersFromText(text = '') {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let name = '', phone = '';
  const qa = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('Имя:'))     name  = line.replace(/^Имя:\s*/i, '').trim();
    if (line.startsWith('Телефон:')) phone = line.replace(/^Телефон:\s*/i, '').trim();

    if (/^Вопрос:/i.test(line)) {
      const q   = line.replace(/^Вопрос:\s*/i, '').trim();
      const nxt = lines[i + 1] || '';
      const m   = nxt.match(/^(Ответы?|Ответ):\s*(.*)$/i);
      const ans = m ? m[2].trim() : '';
      if (m) i++;
      qa.push({ question: q, answer: ans });
    }
  }
  if (phone) qa.unshift({ question: 'Телефон', answer: phone });
  if (name)  qa.unshift({ question: 'Имя',     answer: name  });
  return { name, phone, qa };
}

function buildVkCallbackPayload({ subject, text, vk_mail_id }) {
  const form_name = parseFormName(subject);
  const { qa } = parseAnswersFromText(text);
  return {
    // минимальные изменения: добавили vk_mail_id на корень
    vk_mail_id,
    type: 'lead_forms_new',
    group_id: 0,
    secret: VK_SECRET,
    object: { user_id: 0, form_id: 0, form_name, answers: qa }
  };
}

async function postWithFallback(payload) {
  // 1) локальный
  try {
    const r = await fetch(API_LOCAL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const txt = await r.text();
    console.log(`[LOCAL] ${r.status} ${r.statusText} | resp="${txt}"`);
    if (r.ok) return true;
  } catch (e) {
    console.log(`[LOCAL] network error: ${e?.message || e}`);
  }

  // 2) внешний (если задан)
  if (!API_FALLBACK) return false;

  try {
    const r = await fetch(API_FALLBACK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const txt = await r.text();
    console.log(`[FALLBACK] ${r.status} ${r.statusText} | resp="${txt}"`);
    return r.ok;
  } catch (e) {
    console.log(`[FALLBACK] network error: ${e?.message || e}`);
    return false;
  }
}

(async () => {
  const client = new ImapFlow({
    host: IMAP_HOST, port: IMAP_PORT, secure: true,
    auth: { user: IMAP_USER, pass: IMAP_PASS },
    logger: false
  });

  try {
    console.log(`→ Подключаюсь к ${IMAP_HOST}:${IMAP_PORT} как ${IMAP_USER}`);
    await client.connect();

    const lock = await client.getMailboxLock(IMAP_MAILBOX);
    try {
      const st = await client.status(IMAP_MAILBOX, { messages: true, unseen: true, recent: true });
      console.log(`Папка "${IMAP_MAILBOX}": messages=${st.messages} unseen=${st.unseen} recent=${st.recent}`);

      // Берём все письма ОТ отправителя (без фильтра по \Seen)
      let uids = await client.search({ });
      if (!uids.length) {
        console.log(`Нет писем от ${SENDER}`);
        return;
      }

      // Собираем internalDate для фильтра по дате
      const rows = [];
      for (const uid of uids) {
        const meta = await client.fetchOne(uid, { internalDate: true });
        const d = meta?.internalDate ? new Date(meta.internalDate) : null;
        if (d && d >= DATE_CUTOFF) rows.push({ uid, d });
      }

      if (!rows.length) {
        console.log(`Нет писем от ${SENDER} новее или равных ${DATE_CUTOFF.toISOString()}`);
        return;
      }

      // сортируем по дате (возрастание) и ограничиваем LAST_N при необходимости
      rows.sort((a, b) => a.d - b.d);
      const selected = (LAST_N > 0 && rows.length > LAST_N) ? rows.slice(-LAST_N) : rows;

      console.log(`Отфильтровано по дате: ${selected.length} шт. Отправляю…`);

      for (const { uid } of selected) {
        const msg = await client.fetchOne(uid, { source: true, envelope: true, internalDate: true, flags: true });
        if (!msg?.source) continue;

        const mail = await simpleParser(msg.source);
        const fromAddr = (mail.from?.value?.[0]?.address || '').toLowerCase();
        if (fromAddr !== SENDER) continue; // перестраховка

        // Вычисляем устойчивый id письма для БД
        const vk_mail_id = (mail.messageId || String(uid)).trim();

        const payload = buildVkCallbackPayload({
          subject: mail.subject || '',
          text: mail.text || '',
          vk_mail_id
        });

        const ok = await postWithFallback(payload);

        if (ok && MARK_AS_SEEN_ON_SUCCESS) {
          try {
            await client.messageFlagsAdd(uid, ['\\Seen']);
            console.log(`uid=${uid} → OK, помечено как прочитанное`);
          } catch (e) {
            console.log(`uid=${uid} → OK, но не удалось поставить \\Seen:`, e?.message || e);
          }
        } else {
          console.log(`uid=${uid} → ${ok ? 'OK' : 'FAIL'} (письмо не помечено)`);
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
    console.log('Готово.');
  } catch (e) {
    console.error('Ошибка:', e?.message || e);
    try { await client.logout(); } catch {}
    process.exit(1);
  }
})();




// require('dotenv').config();
// const { ImapFlow } = require('imapflow');
// const { simpleParser } = require('mailparser');

// const IMAP_HOST    = 'imap.yandex.ru';
// const IMAP_PORT    = 993;
// const IMAP_USER    = 'info@jivem-doma.ru';
// const IMAP_PASS    = 'deeisapgcdefhnnf';
// const IMAP_MAILBOX = 'VK заявки в кабинета ads';
// const SENDER       = 'ads.notifications@vk.company';

// const API_LOCAL    = 'http://localhost:3000/api/vk_jdd_for_mail';
// const API_FALLBACK = 'http://https://mls-vlg.ru//api/vk_jdd_for_mail'; // можно оставить пустым, тогда фолбэк не используется
// const VK_SECRET    = 'afe7eea1a58eb43414b91121fcab86d4312a42b4887172';

// // Сколько последних отправлять (0 = все)
// const LAST_N       = Number(process.env.LAST_N || 0);

// // Помечать как прочитанные после успешной отправки
// const MARK_AS_SEEN_ON_SUCCESS = process.env.MARK_AS_SEEN_ON_SUCCESS === 'false' ? false : true;

// // fetch: глобальный (Node18+) или node-fetch по требованию
// const fetch = (...args) =>
//   (globalThis.fetch
//     ? globalThis.fetch(...args)
//     : import('node-fetch').then(m => m.default(...args))
//   );

// // ---------- helpers ----------
// function parseFormName(subject = '') {
//   const m = subject.match(/Новая заявка от формы:\s*(.+)$/i);
//   return (m && m[1]) ? m[1].trim() : (subject || '');
// }

// function parseAnswersFromText(text = '') {
//   const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
//   let name = '', phone = '';
//   const qa = [];
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];
//     if (line.startsWith('Имя:'))     name  = line.replace(/^Имя:\s*/i, '').trim();
//     if (line.startsWith('Телефон:')) phone = line.replace(/^Телефон:\s*/i, '').trim();

//     if (/^Вопрос:/i.test(line)) {
//       const q   = line.replace(/^Вопрос:\s*/i, '').trim();
//       const nxt = lines[i + 1] || '';
//       const m   = nxt.match(/^(Ответы?|Ответ):\s*(.*)$/i);
//       const ans = m ? m[2].trim() : '';
//       if (m) i++;
//       qa.push({ question: q, answer: ans });
//     }
//   }
//   if (phone) qa.unshift({ question: 'Телефон', answer: phone });
//   if (name)  qa.unshift({ question: 'Имя',     answer: name  });
//   return { name, phone, qa };
// }

// function buildVkCallbackPayload({ subject, text }) {
//   const form_name = parseFormName(subject);
//   const { qa } = parseAnswersFromText(text);
//   return {
//     type: 'lead_forms_new',
//     group_id: 0,
//     secret: VK_SECRET,
//     object: { user_id: 0, form_id: 0, form_name, answers: qa }
//   };
// }

// async function postWithFallback(payload) {
//   // 1) локальный
//   try {
//     const r = await fetch(API_LOCAL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//     const txt = await r.text();
//     console.log(`[LOCAL] ${r.status} ${r.statusText} | resp="${txt}"`);
//     if (r.ok) return true;
//   } catch (e) {
//     console.log(`[LOCAL] network error: ${e?.message || e}`);
//   }

//   // 2) внешний (если задан)
//   if (!API_FALLBACK) return false;

//   try {
//     const r = await fetch(API_FALLBACK, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//     const txt = await r.text();
//     console.log(`[FALLBACK] ${r.status} ${r.statusText} | resp="${txt}"`);
//     return r.ok;
//   } catch (e) {
//     console.log(`[FALLBACK] network error: ${e?.message || e}`);
//     return false;
//   }
// }

// (async () => {
//   const client = new ImapFlow({
//     host: IMAP_HOST, port: IMAP_PORT, secure: true,
//     auth: { user: IMAP_USER, pass: IMAP_PASS },
//     logger: false
//   });

//   try {
//     console.log(`→ Подключаюсь к ${IMAP_HOST}:${IMAP_PORT} как ${IMAP_USER}`);
//     await client.connect();
//     await client.mailboxOpen(IMAP_MAILBOX);

//     // ТОЛЬКО НЕпрочитанные письма от отправителя
//     let uids = await client.search({ from: SENDER, seen: false });
//     if (!uids.length) {
//       console.log('Нет новых (непрочитанных) писем от', SENDER);
//       await client.logout();
//       return;
//     }

//     // сортируем по INTERNALDATE (по возрастанию), затем применяем LAST_N
//     const withDates = [];
//     for (const uid of uids) {
//       const meta = await client.fetchOne(uid, { internalDate: true });
//       const ts = meta?.internalDate ? new Date(meta.internalDate).getTime() : 0;
//       withDates.push({ uid, ts });
//     }
//     withDates.sort((a, b) => a.ts - b.ts);
//     uids = (LAST_N > 0 && withDates.length > LAST_N)
//       ? withDates.slice(-LAST_N).map(x => x.uid)
//       : withDates.map(x => x.uid);

//     console.log(`Непрочитанных писем: ${uids.length}. Отправляю…`);

//     for (const uid of uids) {
//       const msg = await client.fetchOne(uid, { source: true, envelope: true, internalDate: true });
//       if (!msg?.source) continue;

//       const mail = await simpleParser(msg.source);
//       const fromAddr = (mail.from?.value?.[0]?.address || '').toLowerCase();
//       if (fromAddr !== SENDER) continue; // перестраховка (алиасы/форварды)

//       const payload = buildVkCallbackPayload({ subject: mail.subject || '', text: mail.text || '' });
//       const ok = await postWithFallback(payload);

//       if (ok && MARK_AS_SEEN_ON_SUCCESS) {
//         // помечаем письмо как прочитанное ТОЛЬКО при успехе
//         try {
//           await client.messageFlagsAdd(uid, ['\\Seen']);
//           console.log(`uid=${uid} → OK, помечено как прочитанное`);
//         } catch (e) {
//           console.log(`uid=${uid} → OK, но не удалось поставить \\Seen:`, e?.message || e);
//         }
//       } else {
//         console.log(`uid=${uid} → ${ok ? 'OK' : 'FAIL'} (письмо не помечено)`);
//       }
//     }

//     await client.logout();
//     console.log('Готово.');
//   } catch (e) {
//     console.error('Ошибка:', e?.message || e);
//     try { await client.logout(); } catch {}
//     process.exit(1);
//   }
// })();
