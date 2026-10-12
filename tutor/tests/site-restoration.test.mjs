import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';

test('home page and classroom use MathsMadeEasyAI branding', () => {
  for (const filename of ['src/app/page.tsx', 'src/app/layout.tsx', 'public/tutor/index.html']) {
    const source = readFileSync(filename, 'utf8');
    assert.ok(source.includes('MathsMadeEasy'), filename);
    assert.ok(!source.includes('CycleAI'), filename);
  }
  const homepage = readFileSync('src/app/page.tsx', 'utf8');
  assert.ok(homepage.includes('href="/tutor/index.html"'));
  assert.equal(JSON.parse(readFileSync('package.json', 'utf8')).name, 'mathsmadeeasyai');
});

test('legacy CycleAI routes redirect home and health code is removed', () => {
  const redirects = readFileSync('next.config.ts', 'utf8');
  for (const route of ['about', 'features', 'pricing', 'science', 'blog', 'privacy', 'how-it-works', 'join-beta', 'signup', 'login', 'dashboard', 'app', 'ai-demo']) {
    assert.ok(redirects.includes(`"${route}"`), route);
    assert.ok(!existsSync(`src/app/${route}/page.tsx`), route);
  }
  assert.ok(redirects.includes('destination: "/"'));
  assert.ok(!existsSync('backend/app/main.py'));
  assert.ok(!existsSync('src/lib/auth-context.tsx'));
  assert.ok(!existsSync('src/components/Navbar.tsx'));
});

test('restored classroom references existing local assets', () => {
  const classroom = readFileSync('public/tutor/index.html', 'utf8');
  const assets = [...classroom.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map(match => match[1].split('?')[0])
    .filter(asset => /\.(?:js|css|svg|html)$/.test(asset) && !asset.startsWith('http'));
  assert.ok(assets.length > 30);
  for (const asset of assets) {
    const filename = asset.startsWith('/') ? resolve('public', asset.slice(1)) : resolve(dirname('public/tutor/index.html'), asset);
    assert.ok(existsSync(filename), asset);
  }
});
