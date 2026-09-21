// Require files and get references to HTML/CSS
const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Actually write the response with the correct content type, status, etc.
const respond = (request, response, content, type, status) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8')
  });
  response.write(content);
  response.end();
};

// NOT NEEDED FOR THIS ASSIGNMENT, JUST A STARTING POINT BASED ON 1ST ASSIGNMENT
const convertMessageAndRespond = (request, response, message, status, id) => {
  // Make object with ID if it's included
  let object;
  if(id != undefined) {
    object = {
      message: message,
      id: id
    };
  }
  else {
    object = {
      message: message,
    };
  }
  return respond(request, response, JSON.stringify(object), 'application/json', status);
}

// THESE WILL CHANGE ONCE YOU GO BEYOND 'GET'
// Helper methods to improve server.js readability
const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200);
};

const getCSS = (request, response) => {
  respond(request, response, css, 'text/css', 200);
}

const testReturn = (request, response, message) => {
  respond(request, response, message, 'text/plain', 200);
}

// Export these functions for use elsewhere
module.exports = {
  getIndex,
  getCSS,
  testReturn,
};