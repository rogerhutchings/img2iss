(function() {

    'use strict';

    // Packages
    var _ = require('lodash');
    var github = require('octonode');
    var request = require('request');

    module.exports = function (file, githubConfig, callback) {

        var repo = github.client(githubConfig.token).repo(githubConfig.repo);

        var options = {
            "title": file.name,
            "body": "![" + file.name + "](" + file.imageUrl + ")"
        };

        repo.issue(options, githubCallback);

        function githubCallback (err, data, headers) {
            if (!err) {
                console.info('GitHub issue #' + data.number + ' created from ' + file.filename);
                callback();
            } else {
                return callback('GitHub says: ' + err.message);
            }
        }

    };

}());
