// Require files and setup port
const http = require('http');
const query = require('querystring');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Deal with incoming data
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
    // Get string of body text
    const bodyString = Buffer.concat(body).toString();
    const type = request.headers['content-type'];
    // Parse
    if(type === 'application/x-www-form-urlencoded') {
      request.body = query.parse(bodyString);
    } else if (type === 'application/json') {
      request.body = JSON.parse(bodyString);
    } else {
      responseHandler.respond(request, response, 'Fail', 'text/plain', 400);
    }
    responseHandler.respond(request, response, '', 'text/plain', 400);
  });
};

// Get the request from the client and figure out what it is
const onRequest = (request, response) => {
  // Setup parsed URL for switch statement
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  
  // Set array of all accepted types
  request.acceptedTypes = request.headers.accept ? request.headers.accept.split(',') : [];

  // Change which function to call based on pathname and parameters
  if(request.method === 'POST') {
    switch (parsedUrl.pathname) {
      case '/addUser':
        parseBody(request, response);
        break;
      default:
        break;
    }
  } else {
    switch (parsedUrl.pathname) {
      case '/':
        responseHandler.getIndex(request, response);
        break;
      case '/style.css':
        responseHandler.getCSS(request, response);
        break;
      case '/getUsers':
        responseHandler.getUsers(request, response);
        break;
      default:
        break;
    }
  }
};

// Make the server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});