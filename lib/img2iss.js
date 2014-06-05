(function() {

    'use strict';

    // Core
    var fs = require('fs');

    // Packages
    var async = require('async');
    var chalk = require('chalk');
    var program = require('commander');

    // Modules
    var config = require('./config');
    var fileList = require('./filelist');
    var gitHub = require('./github');
    var imgur = require('./imgur');

    // Data
    var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));

    // Functions
    var errorHandler = function (err) {
        console.log(chalk.red('Error:'), err.message);
        console.log(chalk.cyan('Exiting!'));
        process.exit(1);
    };

    // Export
    module.exports = function () {

        // Setup
        program
            .version(pkg.version)
            .option('-s, --setup', 'Start in setup mode to enter a new config')
            .usage('[user|org]/<repo> [directory] [options]');

        // Display detailed help
        // TODO: Write all the help
        program.on('--help', function () {
            console.log('Example usage: img2iss rogerhutchings/testrepo ./testdir');
        });

        // Initialise config
        config.initialise(function (err) {
            if (err) {
                errorHandler(err);   
            }
        });

        // Create a list of files and create the issues
        var targetFiles = fileList(config.get('targetDir'));

        async.each(targetFiles, function (file, callback) {

            async.series([

                // Upload to Imgur
                function (callback) {
                    imgur(file, config.get('imgur'), function (err) {
                        if (err) {
                            return callback(err);
                        }
                        callback();
                    });
                },

                // Upload to Github
                function (callback) {
                    gitHub(file, config.get('github'), function (err) {
                        if (err) {
                            return callback(err);
                        }
                        callback();
                    });
                }

            ], function (err) {
                if (err) {
                    return callback(err);
                }
            });

        }, function (err) {
            if (err) {
                return errorHandler(err);
            }
            console.log(targetFiles.length + ' issues successfully created for ' + config.get('github.repo'));
        });

    };

}());
