(function() {

    'use strict';

    // Requirements
    var fs = require('fs');
    var request = require('request');

    module.exports = function (file, imgur, callback) {

        var options = {
            url: 'https://api.imgur.com/3/upload',
            headers: {
                'Authorization': 'Client-ID ' + imgur.id
            },
            json: {
                image: fs.readFileSync(file.filename).toString('base64'),
                type: 'base64'
            }
        };

        function requestCallback (err, res, body) {
            if (!err && res.statusCode == 200) {
                file.imageUrl = body.data.link;
                console.log(file.filename + ' uploaded to ' + body.data.link);
                callback(null, file);
            } else {
                return callback('Imgur says: ' + body.data.error);
            }
        }

        request.post(options, requestCallback);

    };

}());
