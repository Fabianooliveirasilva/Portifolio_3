import { execFileSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test('invalid content breaks the build', () => {
  const bad = 'src/content/projects/zz-invalid.json';
  writeFileSync(bad, JSON.stringify({ name: 'x', order: 'not-a-number' }));
  try {
    expect(() =>
      execFileSync('npx', ['astro', 'sync'], { stdio: 'pipe' }),
    ).toThrow();
  } finally {
    rmSync(bad, { force: true });
  }
});
