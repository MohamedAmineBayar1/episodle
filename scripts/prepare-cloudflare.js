const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) return;
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const openNextDir = path.join(process.cwd(), '.open-next');
const assetsDir = path.join(openNextDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('.open-next/assets/ directory not found. Did the build fail?');
  process.exit(1);
}

// 1. Rename worker.js to _worker.js and move it to assets/
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');

if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, workerDest);
  console.log('Successfully copied worker.js to assets/_worker.js');
} else {
  console.error('worker.js not found in .open-next/');
  process.exit(1);
}

// 2. Copy dependencies to assets/
const deps = [
  'cloudflare',
  'middleware',
  'server-functions',
  '.build',
  'cloudflare-templates',
  'dynamodb-provider'
];

deps.forEach(dep => {
  const src = path.join(openNextDir, dep);
  const dest = path.join(assetsDir, dep);
  if (fs.existsSync(src)) {
    copyRecursiveSync(src, dest);
    console.log(`Successfully copied ${dep} to assets/`);
  } else {
    console.warn(`Optional dependency ${dep} not found, skipping.`);
  }
});

console.log('Preparation complete!');
