(function() {

    'use strict';

    // Requirements
    var _ = require('lodash');
    var fs = require('fs');
    var path = require('path');
    var program = require('commander');

    // Utility method to get and set objects that may or may not exist
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

    module.exports = {

        configFile: __dirname + '/../config/config.json',

        data: {},

        initialise: function () {

            program.parse(process.argv);

            // Load from JSON file
            this.data = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));

            // TODO: throw an error if there's no target repo info

            // TODO: test connect to repo, see if we have access

            // Choose which command line options to save onto config object
            var options = [
                'githubToken',
                'githubUser',
                'imgurId'
            ];

            // Create a string we can use in our set function, and set the value
            // on the config object
            options.forEach(function (option) {
                if (typeof program[option] !== 'undefined') {
                    this.set(option.replace(/[A-Z]/g, function (match) {
                        return '.' + match.toLowerCase();
                    }), program[option]);
                }
            }, this);

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

            // Set repo
            this.set('github.repo', program.args[0]);

        },

        save: function () {
            var saveConfig = {
                github: {
                    token: this.get('github.token'),
                    user: this.get('github.user')
                },
                imgur: this.get('imgur')
            };
            fs.writeFileSync(this.configFile, JSON.stringify(saveConfig, null, 4));
        },

        get: function (key) {
            return getSet(key, undefined, false, this.data);
        },

        set: function (key, value) {
            return getSet(key, value, true, this.data);
        }

    };

}());
