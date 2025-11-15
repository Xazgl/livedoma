 



// #!/usr/bin/env node
// // Берём РОВНО ОДНО непрочитанное письмо от ads.notifications@vk.company (самое новое),
// // шлём на /api/vk_jdd в формате VK Callback и при успехе помечаем его прочитанным.

// require('dotenv').config();
// const { ImapFlow } = require('imapflow');
// const { simpleParser } = require('mailparser');
// const fetch = (...args) => import('node-fetch').then(m => m.default(...args));

// const IMAP_HOST = process.env.IMAP_HOST || 'imap.yandex.ru';
// const IMAP_PORT = Number(process.env.IMAP_PORT || 993);
// const IMAP_USER = process.env.IMAP_USER;
// const IMAP_PASS = process.env.IMAP_PASS;
// const IMAP_MAILBOX = process.env.IMAP_MAILBOX || 'INBOX';
// const SENDER = (process.env.FILTER_FROM || 'ads.notifications@vk.company').toLowerCase();

// const API_URL = 'http://localhost:3000/api/vk_jdd'
// const VK_SECRET = 'afe7eea1a58eb43414b91121fcab86d4312a42b4887172'
// const MARK_AS_SEEN_ON_SUCCESS = true;

// // --- helpers ---
// function parseFormName(subject = '') {
//     const m = subject.match(/Новая заявка от формы:\s*(.+)$/i);
//     return (m && m[1]) ? m[1].trim() : subject || '';
// }

// function parseAnswersFromText(text = '') {
//     const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
//     let name = '', phone = '';
//     const qa = [];
//     for (let i = 0; i < lines.length; i++) {
//         const line = lines[i];
//         if (line.startsWith('Имя:')) name = line.replace(/^Имя:\s*/i, '').trim();
//         if (line.startsWith('Телефон:')) phone = line.replace(/^Телефон:\s*/i, '').trim();

//         if (/^Вопрос:/i.test(line)) {
//             const q = line.replace(/^Вопрос:\s*/i, '').trim();
//             const next = lines[i + 1] || '';
//             const m = next.match(/^(Ответы?|Ответ):\s*(.*)$/i);
//             const ans = m ? m[2].trim() : '';
//             if (m) i++;
//             qa.push({ question: q, answer: ans });
//         }
//     }
//     if (phone) qa.unshift({ question: 'Телефон', answer: phone });
//     if (name) qa.unshift({ question: 'Имя', answer: name });
//     return { name, phone, qa };
// }

// function buildVkCallbackPayload({ subject, text }) {
//     const form_name = parseFormName(subject);
//     const { qa } = parseAnswersFromText(text);
//     return {
//         type: 'lead_forms_new',
//         group_id: 0,
//         secret: VK_SECRET,
//         object: {
//             user_id: 0,
//             form_id: 0,
//             form_name,
//             answers: qa
//         }
//     };
// }
// // --- /helpers ---

// (async () => {
//     if (!IMAP_USER || !IMAP_PASS) { console.error('✖ В .env нет IMAP_USER/IMAP_PASS'); process.exit(1); }
//     if (!API_URL || !VK_SECRET) { console.error('✖ В .env нет API_URL или VK_SECRET'); process.exit(1); }

//     const client = new ImapFlow({
//         host: IMAP_HOST, port: IMAP_PORT, secure: true,
//         auth: { user: IMAP_USER, pass: IMAP_PASS }, logger: false
//     });

//     try {
//         console.log(`→ Подключаюсь к ${IMAP_HOST}:${IMAP_PORT} как ${IMAP_USER}`);
//         await client.connect();
//         await client.mailboxOpen(IMAP_MAILBOX);

//         // берём UIDs непрочитанных от нужного отправителя
//         let uids = await client.search({ from: SENDER, seen: false });

//         if (!uids.length) {
//             console.log('Нет новых писем от', SENDER);
//             await client.logout();
//             return;
//         }

//         // берём только самое новое (UID — монотонно растёт)
//         const uid = uids[uids.length - 1];

//         const msg = await client.fetchOne(uid, { source: true, envelope: true, internalDate: true });
//         if (!msg?.source) { await client.logout(); return; }

//         const mail = await simpleParser(msg.source);
//         const fromAddr = (mail.from?.value?.[0]?.address || '').toLowerCase();
//         if (fromAddr !== SENDER) { await client.logout(); return; }

//         const payload = buildVkCallbackPayload({ subject: mail.subject || '', text: mail.text || '' });

//         // отправляем на эндпоинт
//         const r = await fetch(API_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
//         const txt = await r.text();
//         console.log(`POST ${API_URL} → ${r.status} ${r.statusText} | uid=${uid} | resp="${txt}"`);

//         if (r.ok && MARK_AS_SEEN_ON_SUCCESS) {
//             await client.messageFlagsAdd(uid, ['\\Seen']);
//         }

//         await client.logout();
//     } catch (e) {
//         console.error('Ошибка:', e?.message || e);
//         try { await client.logout(); } catch { }
//         process.exit(1);
//     }
// })();




require('dotenv').config();
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

const IMAP_HOST    =  'imap.yandex.ru';
const IMAP_PORT    = Number(993);
const IMAP_USER    = 'info@jivem-doma.ru';
const IMAP_PASS    = 'deeisapgcdefhnnf';
const IMAP_MAILBOX = 'VK заявки в кабинета ads';
const SENDER       = ('ads.notifications@vk.company').toLowerCase();


(async () => {
  const client = new ImapFlow({
    host: IMAP_HOST, port: IMAP_PORT, secure: true,
    auth: { user: IMAP_USER, pass: IMAP_PASS },
    logger: false
  });

  const out = [];
  try {
    console.log(`→ Подключаюсь к ${IMAP_HOST}:${IMAP_PORT} как ${IMAP_USER}`);
    await client.connect();
    await client.mailboxOpen(IMAP_MAILBOX);

    // все письма от нужного адреса (не только непрочитанные)
    let uids = await client.search({ from: SENDER });
    if (!uids.length) {
      console.log('[]'); // пустой массив, если нет совпадений
      await client.logout();
      return;
    }

    // при желании можно ограничить последние N
    // uids = uids.slice(-50);

    for (const uid of uids) {
      const msg = await client.fetchOne(uid, { source: true, envelope: true, internalDate: true });
      if (!msg?.source) continue;
      const mail = await simpleParser(msg.source);

      // дополнительная проверка реального адреса из заголовка
      const fromAddr = (mail.from?.value?.[0]?.address || '').toLowerCase();
      if (fromAddr !== SENDER) continue;

      out.push({
        uid,
        messageId: mail.messageId || null,
        from: mail.from?.text || null,
        to: mail.to?.text || null,
        subject: mail.subject || null,
        date: mail.date ? mail.date.toISOString() : null,
        text: mail.text || null,
        attachments: (mail.attachments || []).map(a => ({
          filename: a.filename, contentType: a.contentType, size: a.size
        }))
      });
    }

    console.log(JSON.stringify(out, null, 2));
    await client.logout();
  } catch (e) {
    console.error('Ошибка:', e?.message || e);
    try { await client.logout(); } catch {}
    process.exit(1);
  }
})();
