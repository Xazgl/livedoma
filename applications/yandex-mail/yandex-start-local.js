#!/usr/bin/env node
require('dotenv').config();
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

// --- IMAP (как в твоём «рабочем» скрипте) ---
const IMAP_HOST    = 'imap.yandex.ru';
const IMAP_PORT    = 993;
const IMAP_USER    = 'info@jivem-doma.ru';
const IMAP_PASS    = 'deeisapgcdefhnnf';
const IMAP_MAILBOX = 'VK заявки в кабинета ads';
const SENDER       = 'ads.notifications@vk.company';

// --- API и секрет ---
const API_LOCAL    = 'http://localhost:3000/api/vk_jdd_for_mail';
const API_FALLBACK = 'http://https://mls-vlg.ru//api/vk_jdd_for_mail'; // можно оставить пустым, тогда фолбэк не используется
const VK_SECRET    = 'afe7eea1a58eb43414b91121fcab86d4312a42b4887172';

// Сколько последних отправлять (0 = все)
const LAST_N = Number(process.env.LAST_N || 0);

// ---------- helpers ----------
function parseFormName(subject = '') {
  const m = subject.match(/Новая заявка от формы:\s*(.+)$/i);
  return (m && m[1]) ? m[1].trim() : subject || '';
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

function buildVkCallbackPayload({ subject, text }) {
  const form_name = parseFormName(subject);
  const { qa } = parseAnswersFromText(text);
  return {
    type: 'lead_forms_new',
    group_id: 0,
    secret: VK_SECRET,
    object: { user_id: 0, form_id: 0, form_name, answers: qa }
  };
}

async function postWithFallback(payload) {
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
// ---------- /helpers ----------

(async () => {
  const client = new ImapFlow({
    host: IMAP_HOST, port: IMAP_PORT, secure: true,
    auth: { user: IMAP_USER, pass: IMAP_PASS },
    logger: false
  });

  try {
    console.log(`→ Подключаюсь к ${IMAP_HOST}:${IMAP_PORT} как ${IMAP_USER}`);
    await client.connect();
    await client.mailboxOpen(IMAP_MAILBOX);

    let uids = await client.search({ from: SENDER });
    if (!uids.length) {
      console.log('Писем от', SENDER, 'не найдено');
      await client.logout();
      return;
    }

    const withDates = [];
    for (const uid of uids) {
      const meta = await client.fetchOne(uid, { internalDate: true });
      const ts = meta?.internalDate ? new Date(meta.internalDate).getTime() : 0;
      withDates.push({ uid, ts });
    }
    withDates.sort((a, b) => a.ts - b.ts);
    uids = (LAST_N > 0 && withDates.length > LAST_N)
      ? withDates.slice(-LAST_N).map(x => x.uid)
      : withDates.map(x => x.uid);

    console.log(`Найдено писем: ${uids.length}. Отправляю…`);

    for (const uid of uids) {
      const msg = await client.fetchOne(uid, { source: true, envelope: true, internalDate: true });
      if (!msg?.source) continue;

      const mail = await simpleParser(msg.source);
      const fromAddr = (mail.from?.value?.[0]?.address || '').toLowerCase();
      if (fromAddr !== SENDER) continue;

      const payload = buildVkCallbackPayload({ subject: mail.subject || '', text: mail.text || '' });
      const ok = await postWithFallback(payload);

      console.log(`uid=${uid} → ${ok ? 'OK' : 'FAIL'} (ничего не помечаем прочитанным)`);
    }

    await client.logout();
    console.log('Готово.');
  } catch (e) {
    console.error('Ошибка:', e?.message || e);
    try { await client.logout(); } catch {}
    process.exit(1);
  }
})();
