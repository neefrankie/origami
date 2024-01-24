import { basename, extname, resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';

export async function mkDirAll(path: string) {
  await mkdir(path, { recursive: true});

  return path;
}

export async function mkDirDist(...paths: string[]) {
  const dir = resolve(process.cwd(), 'dist', ...paths);
  await mkDirAll(dir);

  return dir;
}

export async function mkCWDSub(...paths: string[]) {
  const dir = resolve(process.cwd(), ...paths);
  await mkDirAll(dir);

  return dir;
}

// Extract base name without extension.
export function extractName(filename: string): string {
  const ext = extname(filename);
  
  return basename(filename, ext)
}

if (require.main === module) {
  mkDirDist('favicons').catch(console.error);
  mkCWDSub('build', 'tc', 'favicons');
}
