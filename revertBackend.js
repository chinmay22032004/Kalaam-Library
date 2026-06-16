import fs from 'fs';

// Remove poet routes from server.js
let serverContent = fs.readFileSync('server/server.js', 'utf8');

const startIndex = serverContent.indexOf('// --- POET ROUTES ---');
const endIndex = serverContent.indexOf('// --- AUTHENTICATION ROUTES ---');

if (startIndex !== -1 && endIndex !== -1) {
  serverContent = serverContent.slice(0, startIndex) + serverContent.slice(endIndex);
  fs.writeFileSync('server/server.js', serverContent);
}

// Remove poet functions from api.js
let apiContent = fs.readFileSync('src/api/api.js', 'utf8');

const poetStart = apiContent.indexOf('  // POETS');
if (poetStart !== -1) {
  const lastIndex = apiContent.lastIndexOf('};');
  if (lastIndex > poetStart) {
    apiContent = apiContent.slice(0, poetStart) + apiContent.slice(lastIndex);
    fs.writeFileSync('src/api/api.js', apiContent);
  }
}
