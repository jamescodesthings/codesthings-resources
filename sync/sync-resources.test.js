import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { sync } from './sync-resources.js';

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

function fixture(files = { 'design/tokens.css': ':root{}\n', 'js/a.js': 'a()\n' }, manifestFiles) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-'));
  const resourcesDir = path.join(root, 'resources');
  const consumerDir = path.join(root, 'consumer');
  fs.mkdirSync(resourcesDir);
  fs.mkdirSync(path.join(consumerDir, 'shared'), { recursive: true });
  git(resourcesDir, 'init', '-q');
  git(resourcesDir, 'config', 'user.email', 't@example.com');
  git(resourcesDir, 'config', 'user.name', 't');
  for (const [p, c] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(resourcesDir, p)), { recursive: true });
    fs.writeFileSync(path.join(resourcesDir, p), c);
  }
  git(resourcesDir, 'add', '-A');
  git(resourcesDir, 'commit', '-q', '-m', 'seed');
  const manifest = {
    resources: '',
    files: manifestFiles ?? Object.keys(files).map((p) => ({ from: p, to: `out/${p}` })),
  };
  fs.writeFileSync(path.join(consumerDir, 'shared/resources.json'), JSON.stringify(manifest, null, 2));
  return { resourcesDir, consumerDir };
}

test('copies each listed file verbatim and records the sha', async () => {
  const { resourcesDir, consumerDir } = fixture();
  const result = await sync({ resourcesDir, consumerDir });
  const sha = git(resourcesDir, 'rev-parse', 'HEAD');
  assert.equal(result.sha, sha);
  assert.deepEqual(result.copied.sort(), ['out/design/tokens.css', 'out/js/a.js']);
  assert.equal(fs.readFileSync(path.join(consumerDir, 'out/design/tokens.css'), 'utf8'), ':root{}\n');
  const manifest = JSON.parse(fs.readFileSync(path.join(consumerDir, 'shared/resources.json'), 'utf8'));
  assert.equal(manifest.resources, sha);
  assert.equal(manifest.files.length, 2);
});

test('refuses when resources has uncommitted changes', async () => {
  const { resourcesDir, consumerDir } = fixture();
  fs.writeFileSync(path.join(resourcesDir, 'design/tokens.css'), 'changed\n');
  await assert.rejects(sync({ resourcesDir, consumerDir }), /uncommitted/);
  assert.equal(fs.existsSync(path.join(consumerDir, 'out')), false);
});

test('fails on a missing source path and copies nothing', async () => {
  const { resourcesDir, consumerDir } = fixture(undefined, [
    { from: 'design/tokens.css', to: 'out/tokens.css' },
    { from: 'nope/missing.css', to: 'out/missing.css' },
  ]);
  await assert.rejects(sync({ resourcesDir, consumerDir }), /nope\/missing\.css/);
  assert.equal(fs.existsSync(path.join(consumerDir, 'out')), false);
});

test('refuses an LFS pointer', async () => {
  const pointer = 'version https://git-lfs.github.com/spec/v1\noid sha256:abc\nsize 12\n';
  const { resourcesDir, consumerDir } = fixture({ 'images/p.jpg': pointer });
  await assert.rejects(sync({ resourcesDir, consumerDir }), /LFS pointer/);
  assert.equal(fs.existsSync(path.join(consumerDir, 'out')), false);
});

test('fails when resourcesDir is not a git checkout', async () => {
  const { consumerDir } = fixture();
  const notGit = fs.mkdtempSync(path.join(os.tmpdir(), 'notgit-'));
  await assert.rejects(sync({ resourcesDir: notGit, consumerDir }), /not a git checkout/);
});
