// Server-only helper to read secret values.
// Order of precedence: explicit env var -> file in the secure dir (outside web root).
// The VPS setup script stores these files at $(dirname DEPLOY_PATH), e.g. /home/capoeiraislife/.printful-token.
import fs from 'fs';
import path from 'path';

export function readSecret(filename, envVar) {
  if (envVar && process.env[envVar] && process.env[envVar].trim()) {
    return process.env[envVar].trim();
  }
  try {
    const dir = process.env.SECURE_DIR || path.join(process.cwd(), '..');
    const value = fs.readFileSync(path.join(dir, filename), 'utf8').trim();
    return value || null;
  } catch {
    return null;
  }
}

export function readSecretNumber(filename, envVar, fallback = null) {
  const raw = readSecret(filename, envVar);
  if (raw == null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}
