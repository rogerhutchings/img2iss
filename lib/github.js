(function() {

    'use strict';

    // Packages
    var _ = require('lodash');
    var request = require('request');
    var github = new (require('github'))({version: '3.0.0'});

    module.exports = function (file, githubConfig, callback) {

        github.authenticate({
            type: 'oauth',
            token: githubConfig.token
        });

        var options = {
            "repo": githubConfig.repo,
            "title": file.name,
            "body": "![" + file.name + "](" + file.imageUrl + ")",
            // Labels are required, even though they can be an empty array.
            "labels": []
        };

        github.issues.create(options, githubCallback);

        function githubCallback (err, res) {
            if (res) {
                console.info('GitHub issue #' + res.number + ' created from ' + file.filename);
                callback();
            } else {
                return callback('GitHub says: ' + err.message);
            }
        }

    };

}());
