(function() {

    'use strict';

    // Core
    var util = require('util');

    // Packages
    var async = require('async');
    var chalk = require('chalk');
    var inquirer = require('inquirer');
    var github = new (require('github'))({version: '3.0.0'});

    // Helper functions
    function testUser (callback) {
        github.authorization.getAll({}, function (err, res) {
            if (err && JSON.parse(err.message).message === 'Bad credentials') {
                return callback(new Error('GitHub username or password is incorrect.'));
            }
            callback(null);
        });
    }


    function userRequires2FA (callback) {
        github.authorization.getAll({}, function (err, res) {
            var has2FA = false;
            if (err && err.code === 401) {
                has2FA = true;
            }
            callback(null, has2FA);
        });
    }

    function get2FA (callback) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'code',
                message: 'Please enter your two-factor authentication code',
                validate: function (answer) {
                    return (answer.length > 0) ? true : 'Code cannot be blank.';
                }
            }
        ], function (answers) {
            callback(null, answers.code);
        });
    }

    function createHeaders (has2FA, callback) {
        var headers = {};
        if (has2FA) {
            get2FA(function (err, code) {
                if (code) {
                    headers['X-GitHub-OTP'] = code;
                }
                callback(err, headers);
            });
        } else {
            callback(null, headers);
        }
    }

    function getCurrentToken (headers, callback) {
        github.authorization.getAll({
            headers: headers
        }, function (err, res) {
            if (err) {
                return callback(new Error(err));
            } else {
                var token;
                res.forEach(function (authItem) {
                    if (authItem.note === 'img2iss') {
                        console.log(chalk.cyan('Existing token found!'));
                        token = authItem.token;
                    }
                });
                callback(null, token);
            }
        });
    }

    function createAuth (headers, callback) {
        github.authorization.create({
            scopes: ['read:org', 'repo'],
            note: 'img2iss',
            note_url: 'http://github.com/rogerhutchings/img2iss',
            headers: headers
        }, function (err, res) {
            if (err) {
                if (err.code === 422) {
                    // Token for img2iss already exists.
                    getCurrentToken(headers, callback);
                } else {
                    return callback(new Error(err));
                }
            } else {
                // Token get! ACHIEVEMENT
                console.log(chalk.cyan('Token created!'));
                callback(null, res.token);
            }
        });
    }

    // Main
    module.exports = function (callback) {

        console.log();
        console.log('Now, I need your GitHub username and password. These will be used to');
        console.log('create an access token for img2iss, and won\'t be saved.');

        inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'GitHub username:',
                validate: function (answer) {
                    return (answer.length > 0) ? true : 'Username cannot be blank.';
                }
            },
            {
                type: 'password',
                name: 'password',
                message: 'GitHub password:',
                validate: function (answer) {
                    return (answer.length > 0) ? true : 'Password cannot be blank.';
                }
            }
        ], function (basic) {

            github.authenticate({
                type: "basic",
                username: basic.username,
                password: basic.password
            });

            testUser(function (err) {
                if (err) return callback(err);

                async.waterfall([
                    userRequires2FA,
                    createHeaders,
                    createAuth
                ], function (err, token) {
                    github.authenticate(null);
                    if (err) return callback(err);
                    callback(null, {
                        user: basic.username,
                        token: token
                    });
                });

            });

        });

    };

}());
