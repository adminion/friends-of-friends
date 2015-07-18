/**
 *  This module exists for the following crappy reasons:
 *  
 *  * jsdoc will only provide the version number in documentation output if 
 *  you provide the `--package` flag
 *  * when you pass the `--package` flag, jsdoc puts the html inside a folder 
 *  whose name is the version number inside a folder whose name is the package name
 *  * I want to have the version number in my docs while having them in the root of `doc/`
 */

var async = require('async'),
    child_process = require('child_process'),
    fs = require('fs'),
    jsdoc2md = require('jsdoc-to-markdown'),
    package = require('../package.json'),
    util = require('util');

    console.log('generating API documentation in doc/');

    async.series([
        // jsdoc
	function (done) {
            async.series([
                function (next) {
                    var child = child_process.exec('jsdoc -c jsdoc.conf.json lib/');

                    child.stdout.on('data', function (data) {
                        console.log(data);
                    });

                    child.stderr.on('data', function (data) {
                        console.log('stderr: ' + data);
                        var err = new Error('error spawning: ', cmd);
                        console.log(err);
                        next(err);
                    });

                    child.on('close', function (code) {
                        if (code === 0) {
                            next();
                        } else {
                            next(new Error('error spawning:', cmd));
                        }
                    });
                },
                function (next) {
                    var cmd = util.format('cp -r doc/%s/%s/* doc/',
                        package.name,
                        package.version
                    );

                    var child = child_process.exec(cmd);

                    child.stdout.on('data', function (data) {
                        console.log(data);
                    });

                    child.stderr.on('data', function (data) {
                        console.log('stderr: ' + data);
                        var err = new Error('error spawning: ', cmd);
                        console.log(err);
                        next(err);
                    });

                    child.on('close', function (code) {
                        if (code === 0) {
                            next();
                        } else {
                            next(new Error('error spawning jsdoc'));
                        }
                    });

                },

                function (next) {
                    var cmd = 'rm -rf doc/'+package.name+'/';

                    var child = child_process.exec(cmd);

                    child.stdout.on('data', function (data) {
                        console.log(data);
                    });

                    child.stderr.on('data', function (data) {
                        console.log('stderr: ' + data);
                        var err = new Error('error spawning: ', cmd);
                        console.log(err);
                        next(err);
                    });

                    child.on('close', function (code) {
                        console.log('child process exited with code ' + code);
                        if (code === 0) {
                            next();
                        } else {
                            next(new Error('error spawning jsdoc'));
                        }
                    });
                }
            ], function (err, results) {

                if (err) done(err);
                else done();
            });
                
        },

	// jsdoc2md
        function (done) {

            console.log('generating markdown docs...');

            var tasks = {},
                taskNames = ['index', 'friendship', 'plugin', 'relationships'];

            // go through each task name
            taskNames.forEach(function (name) {
                // add this task function to the object
                tasks[name] = function (done) {

                    var sourceFilename = 'lib/' + name + '.js';
                    var targetFilename = 'doc/'+ name +'.md';

                    console.log(sourceFilename + ' -> ' + targetFilename);

                    var reader = fs.createReadStream(sourceFilename);

                    // create a write stream to the new markdown file whose name is the task name
                    var writer = fs.createWriteStream(targetFilename, { flags: 'w+'})
                        .on('finish', done);

                    // now pipe each file to jsdoc2md then pipe its output to 
                    // the write stream
                    reader.pipe(jsdoc2md()).pipe(writer);
                };
            }); 

            // now run our named tasks in parallel with async
            async.parallel(tasks, function (err, results) {
                if (err) done(err);
                else {
                    console.log('finished generating markdown docs.');
                    done();  
                } 
            });
        }
    ], function (err, results) {
        if (err) throw err;

        console.log('API documentation generated!');

    });
