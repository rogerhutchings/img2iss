(function() {

    'use strict';

    // Core
    var fs = require('fs');
    var path = require('path');

    // Packages
    var async = require('async');
    var inquirer = require('inquirer');

    // Modules
    var config = require('./config');

    // Main
    module.exports = function (callback) {

        var setupOptions;

        console.log('Hi! It looks like this is the first time you\'ve run img2iss, so I need some');
        console.log('setup information first.');
        console.log();
        console.log('This information is only used to create authentication tokens, and isn\'t saved.');

        inquirer.prompt([
            {
                type: 'input',
                name: 'imgurUsername',
                message: 'What\'s your Imgur username?'
            },
            {
                type: 'password',
                name: 'imgurPassword',
                message: 'What\'s your Imgur password?'
            },
            {
                type: 'input',
                name: 'githubUsername',
                message: 'What\'s your GitHub username?'
            },
            {
                type: 'password',
                name: 'githubPassword',
                message: 'What\'s your GitHub password?'
            }
        ], function (answers) {
            setupOptions = answers;
            // Move to wherever it needs to go!
            // callback();
        });

    };

}());
