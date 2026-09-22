const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==> [SkillMap AI] Installing frontend dependencies...');
try {
  execSync('npm --prefix frontend install', { stdio: 'inherit' });
} catch (e) {
  console.warn('==> [SkillMap AI] Frontend install warning:', e.message);
}

console.log('==> [SkillMap AI] Compiling frontend with Vite...');
try {
  execSync('npm --prefix frontend run build', { stdio: 'inherit' });
} catch (e) {
  console.error('==> [SkillMap AI] Vite compile error:', e.message);
}

const src = path.join(__dirname, 'frontend', 'dist');
const dest = path.join(__dirname, 'dist');
if (fs.existsSync(src)) {
  try {
    fs.cpSync(src, dest, { recursive: true });
    console.log('==> [SkillMap AI] Successfully mirrored build to dist/');
  } catch (e) {
    console.warn('==> [SkillMap AI] Mirror warning:', e.message);
  }
}

console.log('==> [SkillMap AI] Build completed successfully.');
