(function() {

    'use strict';

    // Requirements
    var _ = require('lodash');
    var fs = require('fs');
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

        load: function () {

            program.parse(process.argv);

            // Load from JSON file
            this.data = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));

            // Choose which command line args to save onto config object
            var args = [
                'directory',
                'githubToken',
                'githubUser',
                'imgurId'
            ];

            // Create a string we can use in our set function, and set the value
            // on the config object
            args.forEach(function (arg) {
                if (typeof program[arg] !== 'undefined') {
                    this.set(arg.replace(/[A-Z]/g, function (match) {
                        return '.' + match.toLowerCase();
                    }), program[arg]);
                }
            }, this);

        },

        get: function (key) {
            return getSet(key, undefined, false, this.data);
        },

        set: function (key, value) {
            return getSet(key, value, true, this.data);
        },

        save: function () {

            var saveConfig = {
                github: this.get('github'),
                imgur: this.get('imgur')
            };

            fs.writeFileSync(this.configFile, JSON.stringify(saveConfig, null, 4));

        }

    };

}());
