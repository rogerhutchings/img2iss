(function() {

    'use strict';

    // Core
    var fs = require('fs');
    var path = require('path');

    // Packages
    var async = require('async');
    var github = new (require('github'))({version: '3.0.0'});

    // Main
    module.exports = function (callback) {

        console.log('setting up github');
        callback(null, 'ghSettings');

    };

}());
