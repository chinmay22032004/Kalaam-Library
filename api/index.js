// Vercel Serverless Function entry point.
// It imports the main Express app and exports it for Vercel's serverless runtime.
const app = require('../server/server.js');

module.exports = app;
