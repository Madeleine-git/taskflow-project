const { execSync } = require('child_process');
const fs = require('fs');

// Crear dist limpio
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist');

// Build CSS
console.log('Building CSS...');
execSync('npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify', {
  stdio: 'inherit',
  shell: true
});

// Copiar archivos (forzando sobreescritura)
console.log('Copying files...');
fs.copyFileSync('index.html', 'dist/index.html');
fs.copyFileSync('app.js', 'dist/app.js');

// Verificación
const distContent = fs.readFileSync('dist/index.html', 'utf8');
if (distContent.includes('cdn.tailwindcss.com')) {
  console.error('ERROR: dist/index.html still has CDN!');
  process.exit(1);
} else {
  console.log('✅ dist/index.html is correct (no CDN)');
}

console.log('Build complete!');