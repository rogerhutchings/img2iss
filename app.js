(function () {

    'use strict';

    var flatiron = require('flatiron');
    var path = require('path');
    var app = flatiron.app;

    app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

    app.use(flatiron.plugins.cli, {
        source: path.join(__dirname, 'lib', 'commands'),
        usage: 'Empty Flatiron Application, please fill out commands'
    });

    app.start();

}());
