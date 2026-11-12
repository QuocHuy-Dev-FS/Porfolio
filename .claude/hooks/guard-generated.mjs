#!/usr/bin/env node
// PreToolUse: từ chối Write/Edit/MultiEdit bên trong thư mục do build sinh ra
// (thư mục có file .portfolio-build.json). Chỉ nhìn bên trong thư mục dự án.
// Không mạng, không ghi file, không gọi tiến trình ngoài.
import { existsSync } from 'node:fs';
import { dirname, resolve, relative, join, isAbsolute, sep } from 'node:path';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;
let input;
try { input = JSON.parse(raw); } catch { process.exit(0); }

const target = input?.tool_input?.file_path;
if (typeof target !== 'string' || !target) process.exit(0);

const root = resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
const file = resolve(root, target);
const rel = relative(root, file);
if (!rel || rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) process.exit(0);

let dir = dirname(file);
let found = false;
while (true) {
  if (existsSync(join(dir, '.portfolio-build.json'))) { found = true; break; }
  if (dir === root) break;
  const up = dirname(dir);
  if (up === dir) break;
  dir = up;
}
if (!found) process.exit(0);

const reason = `${rel} do scripts/build.mjs sinh ra và sẽ bị ghi đè ở lần build sau. Hãy sửa data/profile.json hoặc templates/ rồi chạy: node scripts/build.mjs`;
process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: reason,
  },
}));
process.exit(0);
