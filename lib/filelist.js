(function() {

    'use strict';

    // Requirements
    var fs = require('fs');
    var util = require('util');

    // Variables
    var re = /(?:\.([^.]+))?$/;
    var imageTypes = ['jpg', 'jpeg', 'png', 'gif'];

    // Main
    module.exports = function (targetDir) {

        util.print('Creating list of files... ');

        // Read the file list of the target directory, and filter out everything
        // but the images
        var targetFilesArray = fs.readdirSync(targetDir).filter(function (file) {
            var result = imageTypes.indexOf(re.exec(file)[1]);
            return result < 0 ? false : true;
        });

        // Throw an error if there aren't any images
        if (targetFilesArray.length === 0) {
            var err = 'No files to parse in ' + targetDir;
            throw new Error(err);
        }

        // Create an array of objects based on our image file list
        var targetFilesObject = targetFilesArray.map(function (file) {
            return {
                name: file.substr(0, file.lastIndexOf('.')),
                filename: file,
                imageUrl: ''
            };
        });

        console.info(targetFilesObject.length  + ' files found.');

        return targetFilesObject;

    };

}());
