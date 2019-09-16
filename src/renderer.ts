// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let $ = require('jquery');
let request = require('request');
var store = require('data-store')({path: process.cwd() + '/token.json'});

var url = 'https://de.cyverse.org/terrain/token'

$('#loginBtn').on("click", () => {
    var username = ( < HTMLInputElement > document.getElementById('username')).value;
    var password = ( < HTMLInputElement > document.getElementById('password')).value;

    var auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");

    const req = request({
            url: url,
            headers: {
                'Authorization': auth
            },
        },
        function (req: any, res: any, body: any) {
            var jsonObject = JSON.parse(body)
            store.set('token', jsonObject['access_token'])
            if (jsonObject['status'] === 401) {
                console.log(jsonObject['error'])
            } else {
                console.log('Login Success')
                $('#loginModal').modal('toggle');
            }
        }
    )
})