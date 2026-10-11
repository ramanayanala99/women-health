import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { exportMathsTutor } from '../../scripts/export-maths-tutor.mjs';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

test('exports a standalone branded project without changing the original', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'maths-tutor-export-'));
  const destination = join(temporary, 'maths-tutor');
  const originalPackage = await readFile(join(repository, 'package.json'), 'utf8');
  const originalHome = await readFile(join(repository, 'src/app/page.tsx'), 'utf8');
  try {
    assert.equal(await exportMathsTutor(destination), destination);
    const packageData = JSON.parse(await readFile(join(destination, 'package.json'), 'utf8'));
    const lockData = JSON.parse(await readFile(join(destination, 'package-lock.json'), 'utf8'));
    assert.equal(packageData.name, 'maths-tutor');
    assert.equal(lockData.name, 'maths-tutor');
    assert.equal(lockData.packages[''].name, 'maths-tutor');
    assert.match(await readFile(join(destination, 'src/app/page.tsx'), 'utf8'), /Maths Tutor/);
    assert.match(await readFile(join(destination, 'src/app/layout.tsx'), 'utf8'), /Maths Tutor —/);
    assert.match(await readFile(join(destination, 'public/tutor/index.html'), 'utf8'), /<title>Maths Tutor —/);
    assert.match(await readFile(join(destination, 'netlify.toml'), 'utf8'), /publish = "\.next"/);
    assert.match(await readFile(join(destination, '.gitignore'), 'utf8'), /\.env/);
    for (const filename of ['netlify/functions/tutor.mts', 'netlify/lib/tutor-service.mjs', 'netlify/database/migrations/202610090001_create_tutor_progress.sql']) {
      assert.equal(await readFile(join(destination, filename), 'utf8'), await readFile(join(repository, filename), 'utf8'));
    }
    for (const filename of ['.git', '.netlify', '.env', 'backend', 'node_modules', '.next']) {
      await assert.rejects(access(join(destination, filename)), { code: 'ENOENT' });
    }
    await assert.rejects(exportMathsTutor(destination), { code: 'EEXIST' });
    assert.equal(await readFile(join(repository, 'package.json'), 'utf8'), originalPackage);
    assert.equal(await readFile(join(repository, 'src/app/page.tsx'), 'utf8'), originalHome);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('rejects export destinations inside the original repository', async () => {
  await assert.rejects(exportMathsTutor(join(repository, 'maths-tutor')), /outside the existing repository/);
});
