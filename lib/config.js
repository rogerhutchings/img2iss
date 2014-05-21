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

        data: {},

        load: function () {
        
            // Load from JSON file
            this.data = require('../config/config.json');

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



            console.log(saveConfig);


            // try {

            //     var optionsToSave = ['github:token', 'github:user', 'imgur:id'];

            //     if (_.isEmpty(options)) {
            //         throw new Error('No options to save.');
            //     } else {

            //         _.each(options, function (value, nconfArg) {
            //             nconf.set(nconfArg, value);
            //         });

            //         nconf.save(function (err) {
            //             if (err) {
            //                 throw new Error(err.message);
            //             }
            //             console.log('Configuration saved.');
            //             process.exit(0);
            //         });

            //     }
            // }

            // catch (err) {
            //     console.error(err.message);
            //     process.exit(1);
            // }

        }

    };

}());
