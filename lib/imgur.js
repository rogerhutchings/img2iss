(function() {

    'use strict';

    // Core
    var fs = require('fs');

    // Packages
    var request = require('request');

    // Main
    module.exports = function (file, imgurConfig, callback) {

        var options = {
            url: 'https://api.imgur.com/3/upload',
            headers: {
                'Authorization': 'Client-ID ' + imgurConfig.id
            },
            json: {
                image: fs.readFileSync(file.filename).toString('base64'),
                type: 'base64'
            }
        };

        // Upload an image to Imgur, and put the URL returned back on
        // the file object
        request.post(options, requestCallback);

        function requestCallback (err, res, body) {
            if (!err && res.statusCode == 200) {
                file.imageUrl = body.data.link;
                console.info(file.filename + ' uploaded to ' + body.data.link);
                callback(null, file);
            } else {
                return callback(new Error(body.data.error));
            }
        }

    };

}());
