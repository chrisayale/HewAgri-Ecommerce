const { createServer } = require('http');
const next = require('next');
const dotenv = require('dotenv');

// Load environment variables from .env file only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const port = process.env.PORT || 5175; // Default to port 3000 if not specified
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare the Next.js app
app.prepare()
  .then(() => {
    // Create an HTTP server
    createServer((req, res) => {
      // Custom routing can be handled here if needed

      // Default handler for all requests
      handle(req, res);
    })
    .listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
