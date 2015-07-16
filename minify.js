var fs = require('fs');
var util = require('util');
var Transform = require('stream').Transform;

// var readable = require('./app.js');

var argv = require('minimist')(process.argv.slice(2));
console.log(argv.file);

var readstream = fs.createReadStream(argv.input);
readstream.setEncoding('utf8');

var writestream = fs.createWriteStream(argv.output);

//TransformStream is a Class extended from the superclass Transform.
//below we are extending the class.
var TransformStream = function() {
  Transform.call(this, {objectMode: true});
};
util.inherits(TransformStream, Transform);


//this is the method that is automatically caled whenever something is piped into transformStream
//we are overwriting the method here to make it do what we want
TransformStream.prototype._transform = function(chunk, encoding, callback) {
  console.log('transform before : ' , chunk);

  //do your thing here
  var cleanString = chunk.toString().replace(/\r?\n|\r/g, "");

  console.log('transform after : ' + cleanString);
  this.push(cleanString);
  callback();
};

//creating a new instance of the TransformStream Class, which we edited before
var myTransform = new TransformStream();


readstream.pipe(myTransform).pipe(writestream);