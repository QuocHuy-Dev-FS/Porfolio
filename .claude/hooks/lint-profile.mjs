#!/usr/bin/env node
// PostToolUse: kiểm tra data/profile.json ngay sau khi được lưu.
// Chạy trong chính tiến trình này: không mạng, không ghi file, không gọi tiến trình ngoài.
// Có lỗi thì thoát mã 2 để Claude thấy và sửa.
import { readFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;
let input;
try { input = JSON.parse(raw); } catch { process.exit(0); }

const target = input?.tool_input?.file_path;
if (typeof target !== 'string' || !target) process.exit(0);

const root = resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
const file = resolve(root, target);
if (relative(root, file).split(sep).join('/') !== 'data/profile.json') process.exit(0);

let data;
try {
  data = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  process.stderr.write(`data/profile.json không phải JSON hợp lệ: ${e.message}\n`);
  process.exit(2);
}

const errors = [];
const need = (ok, msg) => { if (!ok) errors.push(msg); };

const BUZZ = ['passionate', 'cutting-edge', 'cutting edge', 'world-class', 'rockstar', 'ninja', 'guru', 'hàng đầu', 'đẳng cấp'];
const NUM_IN_PROSE = /\d+([.,]\d+)?\s?(%|x\b|k\b|\+)/i;
const prose = (label, text) => {
  if (typeof text !== 'string') return;
  const low = text.toLowerCase();
  for (const w of BUZZ) if (low.includes(w)) errors.push(`${label}: từ sáo rỗng "${w}"`);
  if (NUM_IN_PROSE.test(text)) errors.push(`${label}: có con số trong câu văn, hãy chuyển vào metrics[] kèm source`);
};

const p = data?.person || {};
need(p.name, 'person.name là bắt buộc');
need(p.title, 'person.title là bắt buộc');
need(p.summary, 'person.summary là bắt buộc');
prose('person.summary', p.summary);

const projects = Array.isArray(data?.projects) ? data.projects : [];
need(projects.length > 0, 'projects[] phải có ít nhất 1 dự án');
const seen = new Set();
projects.forEach((pr, i) => {
  const L = `projects[${i}]${pr?.slug ? ` (${pr.slug})` : ''}`;
  for (const k of ['slug', 'name', 'summary']) need(pr?.[k], `${L}.${k} là bắt buộc`);
  need(Array.isArray(pr?.stack) && pr.stack.length > 0, `${L}.stack phải là mảng không rỗng`);
  need(['public', 'private'].includes(pr?.visibility), `${L}.visibility phải là "public" hoặc "private"`);
  if (pr?.slug) {
    need(/^[a-z0-9-]+$/.test(pr.slug), `${L}.slug chỉ gồm a-z, 0-9 và dấu gạch ngang`);
    need(!seen.has(pr.slug), `${L}.slug bị trùng`);
    seen.add(pr.slug);
  }
  prose(`${L}.summary`, pr?.summary);
  for (const m of pr?.metrics || []) need(m?.label && m?.value && m?.source, `${L}.metrics: mỗi mục cần label, value, source`);
  for (const h of pr?.highlights || []) need(h?.text && h?.source, `${L}.highlights: mỗi mục cần text và source`);
});

(data?.experience || []).forEach((e, i) => (e?.bullets || []).forEach((b, j) => prose(`experience[${i}].bullets[${j}]`, b)));

if (errors.length) {
  process.stderr.write(`Lint data/profile.json phát hiện ${errors.length} lỗi. Hãy sửa trong profile.json:\n- ${errors.join('\n- ')}\n`);
  process.exit(2);
}
process.exit(0);
