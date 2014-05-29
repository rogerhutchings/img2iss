(function() {

    'use strict';

    // Core
    var fs = require('fs');
    var path = require('path');
    
    // Packages
    var _ = require('lodash');
    var program = require('commander');

    // Modules
    var configSetup = require('./config-setup');

    // Utility functions
    // Get and set objects that may or may not exist
    // http://davidwalsh.name/jquery-objects
    var objectifier = function(splits, create, context) {
        var result = context || window;
        for (var i = 0, s; result && (s = splits[i]); i++) {
            result = (s in result ? result[s] : (create ? result[s] = {} : undefined));
        }
        return result;
    };

    var getSet = function(name, value, create, context) {
        // Setter
        if (value !== undefined) {
            var splits = name.split('.'), s = splits.pop(), result = objectifier(splits, true, context);
            return result && s ? (result[s] = value) : undefined;
        }
        // Getter
        else {
            return objectifier(name.split('.'), create, context);
        }
    };

    // Main 
    module.exports = {

        configFile: __dirname + '/../config/config.json',

        data: {},

        initialise: function () {

            program.parse(process.argv);

            // Launch setup if we need to
            if (!fs.existsSync(this.configFile)) {
                configSetup(function (err) {
                    this.main();
                }.bind(this));
            } else {
                this.main();
            }

        },

        main: function () {

            console.log('main!');

            // this.data = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));

            // Set repo
            // TODO: throw an error if there's no target repo info
            // TODO: test connect to repo, see if we have access
            // this.set('github.repo', program.args[0]);

            // Set target dir
            // var targetDir;
            // if (program.args[1]) {
            //     targetDir = path.resolve(program.args[1]);
            //     try {
            //         process.chdir(targetDir);
            //     }
            //     catch (err) {
            //         console.error('Target directory couldn\'t be found');
            //         process.exit(1);
            //     }
            // } else {
            //     targetDir = process.cwd();
            // }
            // this.set('targetDir', targetDir);

        },

        get: function (key) {
            return getSet(key, undefined, false, this.data);
        },

        set: function (key, value) {
            return getSet(key, value, true, this.data);
        }

    };

}());
