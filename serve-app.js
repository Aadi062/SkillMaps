const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const distDir = path.join(__dirname, 'dist');
const frontendDist = path.join(__dirname, 'frontend', 'dist');

// 1. Ensure build exists in both frontend/dist and dist
if (!fs.existsSync(path.join(distDir, 'index.html')) && !fs.existsSync(path.join(frontendDist, 'index.html'))) {
  console.log('==> [SkillMap AI] Production build not found. Running build now...');
  try {
    execSync('npm --prefix frontend install && npm --prefix frontend run build', { stdio: 'inherit' });
    fs.cpSync(frontendDist, distDir, { recursive: true });
    console.log('==> [SkillMap AI] Frontend build completed.');
  } catch (err) {
    console.error('==> [SkillMap AI] Build failed:', err);
    process.exit(1);
  }
}

if (fs.existsSync(frontendDist) && !fs.existsSync(distDir)) {
  fs.cpSync(frontendDist, distDir, { recursive: true });
}

// 2. Determine target serving directory
const targetDir = fs.existsSync(distDir) ? 'dist' : 'frontend/dist';
const port = process.env.PORT || 3000;
console.log(`==> [SkillMap AI] Serving "${targetDir}" on port ${port}...`);

// 3. Launch serve in SPA mode (-s)
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(npxCmd, ['serve', '-s', targetDir, '-l', String(port)], {
  stdio: 'inherit'
});
child.on('exit', (code) => process.exit(code || 0));
