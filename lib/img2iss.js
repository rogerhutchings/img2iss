(function() {

    'use strict';

    // Core
    var fs = require('fs');
    
    // Packages
    var async = require('async');
    var program = require('commander');

    // Modules
    var config = require('./config');
    var createFileList = require('./filelist');
    var createGitHubIssue = require('./github');
    var uploadToImgur = require('./imgur');

    // Data
    var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));

    module.exports = function () {

        // Setup
        program
            .version(pkg.version)
            .option('-d, --directory <directory>', 'sets a target directory. Defaults to the current directory if not set')
            .option('-g, --github-token <token>', 'set the GitHub token to use')
            .option('-u, --github-user <username>', 'set your GitHub username')
            .option('-i, --imgur-id <id>', 'set the Imgur ID to use')
            .option('-s, --save', 'save GitHub and Imgur options as defaults and quit')
            .usage('[user|org]/<repo> [options]');

        // Display detailed help
        // TODO: Write all the help
        program.on('--help', function () {
            console.log('Example setup: img2iss -i foo -g bar -u rogerhutchings -s');
            console.log('Example usage: img2iss rogerhutchings/testrepo');
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
            // TODO: Make more verbose
            console.log('Config saved.');
            process.exit(0);
        }

        // Otherwise, create a list of files and create the issues
        var targetFiles = createFileList(config.get('targetDir'));

        async.each(targetFiles, function (file, callback) {

            async.series([

                // Upload to Imgur
                function (callback) {
                    uploadToImgur(file, config.get('imgur'), function (err, file) {
                        if (err) return callback(err);
                        callback();
                    });
                },

                // Upload to Github
                function (callback) {
                    createGitHubIssue(file, config.get('github'), function (err, result) {
                        if (err) return callback(err);
                        callback();
                    });
                }

            ], function (err) {
                if (err) return callback(err);
            });

        }, function (err) {
            if (err) {
                throw new Error(err);
            }
            console.log(targetFiles.length + ' issues successfully created for ' + config.get('github.repo'));
        });


    };

}());
