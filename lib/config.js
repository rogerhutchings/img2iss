(function() {

    'use strict';

    // Core
    var fs = require('fs');
    var path = require('path');

    // Packages
    var _ = require('lodash');
    var program = require('commander');

    // Modules
    var setup = require('./setup/setup');

    // Utility functions
    // Get and set objects that may or may not exist
    // http://davidwalsh.name/jquery-objects
    var objectifier = function(splits, create, context) {
        var result = context || process;
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

        configFile: __dirname + '/../config.json',

        data: {},

        initialise: function (callback) {

            program.parse(process.argv);

            // Launch setup if we need to, or simply load the config and continue
            if (!fs.existsSync(this.configFile) || program.setup) {
                setup(function (err, configObject) {
                    this.data = configObject;
                    this.save(this.data);
                    this.main(callback);
                }.bind(this));
            } else {
                this.data = this.load();
                this.main(callback);
            }

        },

        load: function () {
            return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        },

        save: function (config) {
            fs.writeFileSync(this.configFile, JSON.stringify(config, null, 4));
            console.info('Config saved.');
        },

        main: function (callback) {

            // Set repo
            // TODO: test connect to repo, see if we have access
            if (program.args[0]) {
                this.set('github.repo', program.args[0]);
            } else {
                return callback(new Error('No target repo specified.'));
            }

            // Set target dir
            var targetDir;
            if (program.args[1]) {
                targetDir = path.resolve(program.args[1]);
                try {
                    process.chdir(targetDir);
                }
                catch (err) {
                    if (err) return callback(new Error('No such file or directory.'));
                }
            } else {
                targetDir = process.cwd();
            }
            this.set('targetDir', targetDir);
            callback();

        },

        get: function (key) {
            return getSet(key, undefined, false, this.data);
        },

        set: function (key, value) {
            return getSet(key, value, true, this.data);
        }

    };

}());
