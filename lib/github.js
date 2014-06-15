(function() {

    'use strict';

    // Packages
    var _ = require('lodash');
    var github = new (require('github'))({version: '3.0.0'});
    var request = require('request');

    module.exports = function (file, githubConfig, callback) {

        github.authenticate({
            type: 'oauth',
            token: githubConfig.token
        });

        github.issues.create({
            'user': githubConfig.user,
            'repo': githubConfig.repo,
            'title': file.name,
            'body': '![' + file.name + '](' + file.imageUrl + ')',
            'labels': []
        }, function (err, res) {
            if (!err) {
                console.info('GitHub issue #' + data.number + ' created from ' + file.filename);
                callback();
            } else {
                return callback(new Error(err));
            }
        });

    };

}());
