(function() {

    'use strict';

    var _ = require('lodash');
    var config = require('./config');
    var fs = require('fs');
    var request = require('request');

    module.exports = function (targetFiles) {

        var imgurOptions = {
            url: 'https://api.imgur.com/3/upload',
            headers: {
                'Authorization': 'Client-ID ' + config.get('imgur.id')
            }
        };

        // TODO: implement an async foreach, e.g. with Semaphore
        targetFiles.forEach(function (file) {
            var options = _.extend(imgurOptions, {
                json: {
                    image: fs.readFileSync(file.filename).toString('base64'),
                    type: 'base64'
                }
            });

            request.post(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    file.imageUrl = body.data.link;
                }
            });
        });

    };

}());
