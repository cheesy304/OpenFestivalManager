const fs = require('fs-extra');

// Copy the file
fs.copySync('src/views', 'dist/views');
fs.copySync('src/public', 'dist/public');

console.log('Dir copied successfully!');