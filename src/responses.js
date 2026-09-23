// Require files and get references to HTML/CSS
const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Actual data
const users = {};

// Actually write the response with the correct content type, status, etc.
const respond = (request, response, content, type, status) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8')
  });
  if(request.method !== 'HEAD' && status !== '204') {
    response.write(content);
  }
  response.end();
};

// Add a user
const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age required'
  };
  const { name, age } = request.body;
  // If either field is missing, fail
  if(!name || !age) {
    responseJSON.id = 'Missing paramaters';
    return respond(request, response, JSON.stringify(responseJSON), 'application/json', 400);
  }
  // If good, assume update (204) until confirmed new
  let statusCode = 204;
  responseJSON.message = 'Updated existing user';
  if(!users[name]) {
    // New user
    statusCode = 201;
    users[name] = {
      name: name
    }
    responseJSON.message = 'Made new user';
  }
  users[name].age = age;
  // Respond doesn't write to 204 so no conditional statement is needed
  return respond(request, response, JSON.stringify(responseJSON), 'application/json', statusCode);
}

// Put users into JSON format and respond
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  respond(request, response, JSON.stringify(responseJSON), 'application/json', 200);
}

// Helper methods to improve server.js readability
const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200);
};

const getCSS = (request, response) => {
  respond(request, response, css, 'text/css', 200);
}

// Export these functions for use elsewhere
module.exports = {
  respond,
  addUser,
  getUsers,
  getIndex,
  getCSS,
};