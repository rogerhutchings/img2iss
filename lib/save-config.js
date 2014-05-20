(function() { 'use strict';  module.exports = function () {

    var nconf = require('nconf');
    var program = require('commander');
    var _ = require('lodash');

    try {

        // Set saveable options on nconf
        var options = _.each({
            'github:token': program.githubToken,
            'github:user': program.githubUser,
            'imgur:id': program.imgurId
        }, function (programArg, nconfArg, options) {
            if (typeof programArg === 'undefined') {
                delete options[nconfArg];
            }
        });

        if (_.isEmpty(options)) {
            throw new Error('No options to save.');
        } else {

            _.each(options, function (value, nconfArg) {
                nconf.set(nconfArg, value);
            });

            nconf.save(function (err) {
                if (err) {
                    throw new Error(err.message);
                }
                console.log('Configuration saved.');
                process.exit(0);
            });

        }
    }

    catch (err) {
        console.error(err.message);
        process.exit(1);
    }


}; }());
