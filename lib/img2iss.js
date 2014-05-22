(function() {

    'use strict';

    // Requirements
    var _ = require('lodash');
    var config = require('./config');
    var fs = require('fs');
    var imgurUpload = require('./imgur');
    var program = require('commander');

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

        // Create file list
        var targetFiles = (function () {

            var re = /(?:\.([^.]+))?$/;

            var targetFilesArray = fs.readdirSync(config.get('targetDir')).filter(function (file) {
                var result = ['jpg', 'jpeg', 'png'].indexOf(re.exec(file)[1]);
                return result < 0 ? false : true;
            });

            try {
                if (targetFilesArray.length === 0) {
                    var err = 'No files to parse in ' + config.get('targetDir');
                    throw new Error(err);
                }
            }

            catch (err) {
                console.error(err.message);
                process.exit(1);
            }

            return targetFilesArray.map(function (file) {
                return {
                    name: file.substr(0, file.lastIndexOf('.')),
                    filename: file,
                    imageUrl: ''
                };
            });

        })();


        // Upload to Imgur
        imgurUpload(targetFiles);


        console.log(targetFiles);

    };

}());
