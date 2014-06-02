(function() {

    'use strict';

    // Packages
    var inquirer = require('inquirer');
    
    // Main
    module.exports = function (callback) {

        inquirer.prompt([
            {
                type: 'input',
                name: 'githubUsername',
                message: 'What\'s your GitHub username?',
                validate: function (answer) {
                    return (answer.length > 0) ? true : 'You need to enter a GitHub username.';
                }
            },
            {
                type: 'input',
                name: 'githubToken',
                message: 'What\'s your GitHub token?',
                validate: function (answer) {
                    return (answer.length > 0) ? true : 'You need to enter a GitHub token.';
                }
            }
        ], function (answers) {
            callback(null, {
                user: answers.githubUsername,
                token: answers.githubToken
            });
        });

    };

}());
