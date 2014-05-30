(function() {

    'use strict';

    // Core
    var fs = require('fs');
    var path = require('path');

    // Packages
    var async = require('async');
    var inquirer = require('inquirer');
    var github = new (require('github'))({version: '3.0.0'});

    // Modules
    var config = require('./config');
    var async = require('async');
    var inquirer = require('inquirer');

    function testAuth (callback) {
        // Test a user who will always exist.
        github.user.getFrom({
            user:'github'
        }, callback);
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
                message: 'two-factor authentication code',
                validate: function (answer) {
                    // Something must be input.
                    return answer.length > 0;
                }
            }
        ], function (answers) {
            callback(null, answers);
        });
    }

    function getCurrentToken (headers, callback) {
        github.authorization.getAll({
            headers: headers
        }, function (err, res) {
            if (err) {
                throw err;
            } else {
                var token;
                res.forEach(function (authItem) {
                    if (authItem.note === 'img2iss') {
                        console.log('found existing token');
                        token = authItem.token;
                    }
                });
                callback(null, token);
            }
        });
    }

    function createGitHubAuth (callback) {
        console.log('createGitHubAuth');
        async.waterfall([
            userRequires2FA,
            function (has2FA, callback) {
                var headers = {};
                if (has2FA) {
                    get2FA(function (code) {
                        if (code) {
                            headers['X-GitHub-OTP'] = code;
                        }
                    });
                }
                callback(null, headers);
            },
            function (headers, callback) {
                github.authorization.create({
                    // https://developer.github.com/v3/oauth/#scopes
                    scopes: ['public_repo'],
                    // UID
                    note: 'img2iss',
                    headers: headers
                }, function (err, res) {
                    if (err) {
                        if (err.code === 422) {
                            // Token for img2iss already exists.
                            // This runs and the code prompt starts, but the process exits because I think there's something wrong with how this callback is setup and it's being called too early, before getCurrentToken has a chance to call it.
                            getCurrentToken(headers, callback);
                        } else {
                            // Something went wrong.
                            console.log('GitHub says: ' + err.message);
                            callback(err);
                        }
                    } else {
                        // Token get! ACHIEVEMENT
                        console.log(res.token);
                        callback(null, res.token);
                    }
                });
            }
        ], function (err, token) {
            console.log('createGitHubAuth callback');
            console.log(arguments);
            callback.apply(arguments);
        });
    }

    function createImgurAuth (callback) {
        callback(null, '');
    }

    function setUserConfig (callback) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'imgurUsername',
                message: 'What\'s your Imgur username?'
            },
            {
                type: 'password',
                name: 'imgurPassword',
                message: 'What\'s your Imgur password?'
            },
            {
                type: 'input',
                name: 'githubUsername',
                message: 'What\'s your GitHub username?'
            },
            {
                type: 'password',
                name: 'githubPassword',
                message: 'What\'s your GitHub password?'
            }
        ], function (answers) {
            // Do stuff with Imgur user:pass.
            // Use of GitHub's Authorizations API must be via basic auth.
            github.authenticate({
                type: 'basic',
                username: answers.githubUsername,
                password: answers.githubPassword
            });
            console.log('prompt answers');
            // Move to wherever it needs to go!
            callback(null, answers);
        });
    }

    // Main
    module.exports = function (callback) {

        console.log('Hi! It looks like this is the first time you\'ve run img2iss, so I need some');
        console.log('setup information first.');
        console.log();
        console.log('This information is only used to create authentication tokens, and isn\'t saved.');

        async.series([
            setUserConfig,
            createGitHubAuth,
            createImgurAuth
        ], function (config, githubAuth, imgurAuth) {
            console.log('async.series');
            // Delete saved passwords?
            github.authenticate(null);
            // Return config.
            callback(null, {
                github: {
                    username: config.githubUsername,
                    token: githubAuth
                },
                imgur: {
                    username: config.imgurUsername,
                    token: imgurAuth
                }
            });
        });

    };

}());
