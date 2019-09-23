// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let $ = require('jquery');
let request = require('request');
var store = require('data-store')({path: process.cwd() + '/token.json'});

var url = 'https://de.cyverse.org/terrain/token'

$('#loginBtn').on('click', () => {
    var username = ( < HTMLInputElement > document.getElementById('username')).value;
    var password = ( < HTMLInputElement > document.getElementById('password')).value;

    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

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
                $('#loginModal').modal('toggle');
                $('#usernameBtn').html('<i class="fa fa-user"></i> ' + username);
                $('#loginNav').hide();
                $('#loggedInUser').show();

                // lets list apps... also a better way of using requests
                var query_params = "DE Word Count";
                var query_encoded = encodeURIComponent(query_params)
                const options = {
                    url: 'https://de.cyverse.org/terrain/apps?search='+query_encoded,
                    headers: {
                        "Authorization": "Bearer " + store.get('token')
                    }
                }

                // Takes a few seconds to open
                request(options, function(err: any, res: any, body: any){
                    var appsJson = JSON.parse(body);

                    for (let i = 0; i < appsJson['apps'].length; i++) {
                        const app = appsJson['apps'][i];
                        if (app['name'] == query_params) {
                            console.log('Made it!')
                        }
                    }
                });
            }
        }
    )
})