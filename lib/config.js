(function() {

    'use strict';

    // Core
    var fs = require('fs');
    var path = require('path');
    
    // Packages
    var _ = require('lodash');
    var program = require('commander');

    module.exports = {

        configFile: __dirname + '/../config/config.json',

        data: {},

        initialise: function () {

            program.parse(process.argv);

            // Load config file, or launch setup if there isn't one
            if (fs.existsSync(this.configFile)) {
                this.data = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
            } else {
                this.setup();
            }

            // Set repo
            // TODO: throw an error if there's no target repo info
            // TODO: test connect to repo, see if we have access
            this.set('github.repo', program.args[0]);

            // Set target dir
            var targetDir;
            if (program.args[1]) {
                targetDir = path.resolve(program.args[1]);
                try {
                    process.chdir(targetDir);
                }
                catch (err) {
                    console.error('Target directory couldn\'t be found');
                    process.exit(1);
                }
            } else {
                targetDir = process.cwd();
            }
            this.set('targetDir', targetDir);

        },

        setup: function () {
            console.log('kicking off setup!');
        },

        get: function (key) {
            return getSet(key, undefined, false, this.data);
        },

        set: function (key, value) {
            return getSet(key, value, true, this.data);
        }

    };

    // Utility method to get and set objects that may or may not exist
    // http://davidwalsh.name/jquery-objects
    objectifier = function(splits, create, context) {
        var result = context || window;
        for (var i = 0, s; result && (s = splits[i]); i++) {
            result = (s in result ? result[s] : (create ? result[s] = {} : undefined));
        }
        return result;
    };

    getSet = function(name, value, create, context) {
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

}());
