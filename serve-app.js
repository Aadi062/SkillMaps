const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const distDir = path.join(__dirname, 'frontend', 'dist');
const indexHtml = path.join(distDir, 'index.html');

// 1. If frontend/dist/index.html does not exist, build frontend automatically
if (!fs.existsSync(indexHtml)) {
  console.log('==> [SkillMap AI] Production build not found. Running build now...');
  try {
    execSync('npm --prefix frontend install && npm --prefix frontend run build', {
      stdio: 'inherit'
    });
    console.log('==> [SkillMap AI] Frontend build completed successfully.');
  } catch (err) {
    console.error('==> [SkillMap AI] Frontend build failed:', err);
    process.exit(1);
  }
}

// 2. Start serving on the assigned PORT (Render, Heroku, or 3000)
const port = process.env.PORT || 3000;
console.log(`==> [SkillMap AI] Serving production app on port ${port}...`);

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(npxCmd, ['serve', '-s', 'frontend/dist', '-l', String(port)], {
  stdio: 'inherit'
});
child.on('exit', (code) => process.exit(code || 0));
