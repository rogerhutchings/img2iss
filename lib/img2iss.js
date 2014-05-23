(function() {

    'use strict';

    // Requirements
    var _ = require('lodash');
    var async = require('async');
    var fs = require('fs');
    var program = require('commander');

    // Modules
    var config = require('./config');
    var createFileList = require('./filelist');
    var createGitHubIssue = require('./github');
    var uploadToImgur = require('./imgur');


    module.exports = function () {

        // Setup
        program
            .version('0.0.1')
            .option('-d, --directory <directory>', 'Specifies a target directory. Defaults to the current directory')
            .option('-g, --github-token <token>', 'Set the GitHub token to be used')
            .option('-u, --github-user <username>', 'Set your GitHub username')
            .option('-i, --imgur-id <id>', 'Set the Imgur ID to be used')
            .option('-s, --save', 'Save GitHub and Imgur options as defaults and exit')
            .usage('<user/repo> [options]');

        // Display detailed help
        // TODO: Write all the help
        program.on('--help', function(){
            console.log('Here\'s all the help!');
        });

        // Create config
        config.initialise();

        // Save out existing options if we have them, and quit
        if (program.save === true) {
            try {
                config.save();
            }
            catch (err) {
                console.error(err.message);
                process.exit(1);
            }
            console.log('Config saved.');
            process.exit(0);
        }

        // Otherwise, create a list of files and create the issues
        var targetFiles = createFileList(config.get('targetDir'));

        // async.each(targetFiles, function (file, callback) {

        //     async.series([

        //         // Upload to Imgur
        //         function (callback) {
        //             uploadToImgur(file, config.get('imgur'), function (err, file) {
        //                 if (err) return callback(err);
        //                 callback();
        //             });
        //         },

        //         // Upload to Github
        //         function (callback) {
        //             createGitHubIssue(file, function (err, result) {
        //                 if (err) return callback(err);
        //                 callback();
        //             });
        //         }

        //     ], function (err) {
        //         if (err) return callback(err);
        //     });

        // }, function(err) {
        //     if (err) throw new Error(err);
        // });

    };

}());
