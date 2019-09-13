// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var username = document.getElementById('username');
var password = document.getElementById('password');
var request = require('request');

request('https://de.cyverse.org/terrain/token', {
    'user': {
        'username': username,
        'password': password
    }
});

// console.log(getToken)

// var token = getToken.json()['access_token'];
// var auth_headers = {"Authorization": "Bearer " + token};