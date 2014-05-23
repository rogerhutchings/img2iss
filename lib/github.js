(function() {

    'use strict';

    var _ = require('lodash');
    var github = require('octonode');
    var request = require('request');

    module.exports = function (file, githubConfig, callback) {

        var repo = github.client(githubConfig.token).repo(githubConfig.repo);



        repo.issue({
            "title": file.name,
            "body": "![" + file.name + "](" + file.imageUrl + ")"
        }, function (err, data, headers) {
            console.log(JSON.stringify(data, null, 4));
            callback();
        });






        // repo.issues(function (err, data, headers) {

        //     console.log(file);
        //     // console.log(JSON.stringify(data, null, 4));
        //     callback();

        // });


        // console.log('Uploading to GitHub...');



    };

}());
