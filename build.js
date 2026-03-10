const { execSync } = require('child');
const fs = require('fs');
const path = require('path');

// Crear dist si no existe
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Build CSS con npx
console.log('Building CSS...');
execSync('npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify', {
  stdio: 'inherit',
  shell: true
});

// Copiar archivos
console.log('Copying files...');
fs.copyFileSync('index.html', 'dist/index.html');
fs.copyFileSync('app.js', 'dist/app.js');

console.log('Build complete!');