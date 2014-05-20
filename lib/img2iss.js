(function() { 'use strict';  module.exports = function () {

    var saveConfig = require('./save-config');

    // Requirements
    var nconf = require('nconf');
    var program = require('commander');
    var _ = require('lodash');

    // Load config
    nconf.use('file', { file: './config/config.json' });
    nconf.load();

    // Setup
    program
        .version('0.0.1')
        .option('-d, --directory <directory>', 'Specifies a target directory. Defaults to the current directory')
        .option('-g, --github-token <token>', 'Set the GitHub token to be used')
        .option('-u, --github-user <username>', 'Set your GitHub username')
        .option('-i, --imgur-id <id>', 'Set the Imgur ID to be used')
        .option('-s, --save', 'Save GitHub and Imgur options as defaults and exit');

    // Display detailed help
    // TODO: Write all the help
    program.on('--help', function(){
        console.log('Here\'s all the help!');
    });

    // Parse arguments
    program.parse(process.argv);

    // Save out existing options if we have them
    if (program.save === true) {
        saveConfig();
    }






















}; }());
