(function() {

    'use strict';

    // Core
    var fs = require('fs');
    var path = require('path');

    // Packages
    var async = require('async');
    var inquirer = require('inquirer');

    // Modules
    var config = require('../config');
    var setupImgur = require('./setup-imgur');
    var setupGitHub = require('./setup-github');

    // Main
    module.exports = function (callback) {

        console.log('Hi! It looks like this is the first time you\'ve run img2iss, so I need some');
        console.log('setup information first.');
        console.log();

        async.series({
            imgur: setupImgur,
            github: setupGitHub
        }, function (err, tokens) {
            console.log(tokens);
            console.log('finish setup functions!');
        });

    };

}());
