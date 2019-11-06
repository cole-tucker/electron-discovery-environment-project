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
                    var datatext:String = "data-system="+app['system_id']+" data-id="+app['id']
                    $('#browse-apps').append('<div class="card border col-5 mt-1" id="app-card-'+ i + '">')
                    $('#app-card-'+ i).append('<div class="card-body" id="app-card-body-' + i +'">')
                    $('#app-card-body-' + i).append('<h4 class="card-title">' + app['name'] + '</h4>')
                    $('#app-card-body-' + i).append('<p class="card-text">' + app['description'] + '</p>')
                    $('#app-card-body-' + i).append('<button type="button" '+ datatext +' class="btn btn-primary center showApp viewapp" id="app-select-' + i + '">Select</button>')
                }
            }
            $('#browse-apps').show()
        })
    }
});

$(document).on("click", ".viewapp",
    function (event:any) {
        var elem:HTMLElement = event.target
        var system_id:String = $(elem).data('system')
        var id:String = $(elem).data('id')
        applyAppTemplate(elem)
    }
);

$(document).on("click", "#submit-app",
    function (event:any) {
        $('#show-app').empty()
    }
);

var stored_groups_length = -1;
var stored_app_length = new Array()
var stored_app_id = ""
var stored_system_id = ""

var applyAppTemplate = function (elem:any) {
    const options = {
        url: 'https://de.cyverse.org/terrain/apps/' + system_id + '/' + app_id,
        headers: {
            "Authorization": "Bearer " + store.get('token')
        }
    }

    var jelm = $(elem);//convert to jQuery Element
    stored_app_id = jelm.data("id");
    stored_system_id = jelm.data("system");
    var app_id = encodeURI(jelm.data("id"));
    var system_id = encodeURI(jelm.data("system"))

    $('#browse-apps').hide()
    $('#show-app').show()

    fetch('https://de.cyverse.org/terrain/apps/' + system_id + '/' + app_id, options)
        .then(response => response.json())
        .then(data => {
            var groups = data.groups;
            var inputs = ``
            stored_groups_length = groups.length;
            for (var i = 0; i < groups.length; i++) {
                var paramaters = groups[i].parameters;
                stored_app_length.push(paramaters.length);
                for (var j = 0; j < paramaters.length; j++) {
                    var param = paramaters[j];
                    var new_input =
                    `
                    <div class="form-group">
                    <label for="input${i}${j}">${param.label}</label>
                    <input data-id="${param.id}" type="text" class="form-control" id="input${i}${j}" aria-describedby="helpme${i}${j}" placeholder="...">
                    <small id="helpme${i}${j}" class="form-text text-muted">${param.description}</small>
                    </div>
                    `

                    inputs += new_input;
                }
            }
            var app_html =
            `
            <h1> ${jelm.data("name")} </h1>
            <sub> If you're using the DE Word Count App try using this as the File Input! </sub>
            <br/>
            <sub> <span style="background-color:lightgray"> /iplant/home/shared/workshop_material/terrain_intro/essay.txt </span> </sub>
            <hr/>
            <form>
            ` + inputs + `
                <button id="submit-app" class="btn btn-primary">Submit</button>
            </form>
            `
            $('#show-app').append(app_html);
            // hideLoader();
        });
}