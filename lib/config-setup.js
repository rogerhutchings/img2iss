(function() {

    'use strict';

    // Core
    var fs = require('fs');
    var path = require('path');
    
    // Packages
    var inquirer = require('inquirer');

    // Modules
    var config = require('./config');

    // Main
    module.exports = function () {

        var setupOptions = {};

        console.log('Hi! It looks like this is the first time you\'ve run img2iss, so I need some setup information first.\n\nThis information is only used to create authentication tokens, and isn\'t saved.');

        var questions = [
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
        ];

        inquirer.prompt(questions, function (answers) {
            console.log(answers);
        });

    };

}());
