const { execSync } = require('child_process');

try {
  console.log('Building CSS...');
  execSync('npx tailwindcss -i ./src/input.css -o ./output.css --minify', {
    stdio: 'inherit'
  });
  console.log('Build completed!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}