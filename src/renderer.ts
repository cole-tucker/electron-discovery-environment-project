// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import request = require('request');

var username = document.getElementById('username');
var password = document.getElementById('password');

var getToken = request.get('https://de.cyverse.org/terrain/token', {
    'auth' : {
        'user' : username,
        'pass' : password
    }
});