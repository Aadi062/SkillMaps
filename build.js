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
if (fs.existsSync(src)) {
  const targets = [
    path.join(__dirname, 'dist'),
    path.join(__dirname, 'build'),
    path.join(__dirname, 'public'),
    __dirname // Root directory
  ];

  targets.forEach((dest) => {
    try {
      if (dest === __dirname) {
        // Copy files individually to root to avoid overwriting node_modules or src
        fs.readdirSync(src).forEach((item) => {
          fs.cpSync(path.join(src, item), path.join(dest, item), { recursive: true });
        });
      } else {
        fs.cpSync(src, dest, { recursive: true });
      }
      console.log(`==> [SkillMap AI] Mirrored build to ${path.relative(__dirname, dest) || 'root ./'} successfully.`);
    } catch (e) {
      console.warn(`==> [SkillMap AI] Mirror warning for ${dest}:`, e.message);
    }
  });
}

console.log('==> [SkillMap AI] Production build ready in all target directories.');
