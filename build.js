const { execSync } = require('child_process');
const fs = require('fs');

// Build CSS en RAÍZ
console.log('Building CSS...');
execSync('npx tailwindcss -i ./src/input.css -o ./output.css --minify', {
  stdio: 'inherit',
  shell: true
});

console.log('✅ Build complete! output.css en raíz');
// ... todo tu código actual ...

console.log('Build complete!');

// Deploy: 2026-03-11 13:45