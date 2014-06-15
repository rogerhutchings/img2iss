(function() {

    'use strict';

    // Packages
    var inquirer = require('inquirer');

    // Main
    module.exports = function (callback) {

        // Imgur requires all apps to be registered via the website, so we need
        // to send the user off to get a client ID for us.

        console.log('Firstly, I need your Imgur client ID. You may need to set one up on your');
        console.log('Imgur account.');

        inquirer.prompt([
            {
                type: 'input',
                name: 'imgurID',
                message: 'Imgur client ID:',
                validate: function (answer) {
                    return (answer.length > 0) ? true : 'You need to enter a client ID.';
                }
            }
        ], function (answers) {
            callback(null, {
                id: answers.imgurID
            });
        });

    };

}());
