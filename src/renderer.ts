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
            }
        }
    )
})

$('#searchBtn').on('click', () => {
    var query_params = ( < HTMLInputElement > document.getElementById('search-input')).value;
    var query_encoded = encodeURIComponent(query_params)
    const options = {
        url: 'https://de.cyverse.org/terrain/apps?search='+query_encoded,
        headers: {
            "Authorization": "Bearer " + store.get('token')
        }
    }

    // Takes a few seconds to open
    if (query_params !== '') {
        $('#browse-apps').empty()
        request(options, function(err: any, res: any, body: any){
            var appsJson = JSON.parse(body);
    
            $('#browse-apps').append('<h2>App Search Results</h2>')
            for (let i = 0; i < appsJson['apps'].length; i++) {
                const app = appsJson['apps'][i];
                if (app['name'].includes(query_params)) {
                    $('#browse-apps').append('<div class="col-1">')
                    $('#browse-apps').append('<div class="card border col-5 mt-1" id="app-card-'+ i + '">')
                    $('#app-card-'+ i).append('<div class="card-body" id="app-card-body-' + i +'">')
                    $('#app-card-body-' + i).append('<h4 class="card-title">' + app['name'] + '</h4>')
                    $('#app-card-body-' + i).append('<p class="card-text">' + app['description'] + '</p>')
                    $('#app-card-body-' + i).append('<button type="button" class="btn btn-primary center">Select</button>')
                }
            }
            $('#browse-apps').show()
        })
    }
});