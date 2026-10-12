import { execFileSync } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Renders each profiles/**/banner.svg to banner.export.png at the SVG's own width and height.
// Headless Chrome is used because it loads web fonts and renders as a browser does.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function banners(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return banners(path);
    return entry.name === 'banner.svg' ? [path] : [];
  });
}

for (const svg of banners(resolve(root, 'profiles'))) {
  const [, width, height] = readFileSync(svg, 'utf-8').match(/<svg[^>]*width="(\d+)"[^>]*height="(\d+)"/) ?? [];
  if (!width) {
    console.error(`Skipping ${svg}: no width and height on the <svg> element`);
    continue;
  }
  const png = svg.replace(/\.svg$/, '.export.png');
  execFileSync(
    chrome,
    ['--headless=new', '--hide-scrollbars', `--window-size=${width},${height}`, '--virtual-time-budget=5000', `--screenshot=${png}`, `file://${svg}`],
    { stdio: 'ignore' },
  );
  console.log(`${png} (${width}x${height})`);
}
