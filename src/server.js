// Require files and setup port
const http = require('http');
const query = require('querystring');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response) => {
  // Incoming data
  const body = [];
  // Stop if upload breaks partway through
  request.on('error', (err) => {
    response.statusCode = 400;
    response.end();
  });
  // Add data to body as it comes in
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  // Got all data
  request.on('end', () => {
    // DO STUFF HERE


    // DO STUFF HERE
  });
  responseHandler.testReturn(request, response, "Testing!");
}

// Get the request from the client and figure out what it is
const onRequest = (request, response) => {
  // Setup parsed URL for switch statement
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  
  // Set array of all accepted types
  request.acceptedTypes = request.headers.accept ? request.headers.accept.split(',') : [];

  // Do something!
  // Change which function to call based on pathname and parameters
  switch (parsedUrl.pathname) {
    case '/':
      responseHandler.getIndex(request, response);
      break;
    case '/style.css':
      responseHandler.getCSS(request, response);
      break;
    default:
      break;
  }
};

// Make the server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});