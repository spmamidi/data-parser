var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-config.json');

var s3 = new AWS.S3({apiVersion: '2006-03-01'});
// Load credentials and set region from JSON file
var bucketName = "govgrantsassets";
var params = {Bucket: bucketName};
fs = require('fs');
var fileName = "a.txt"
s3.listObjects(params, function(err, data){
    var bucketContents = data.Contents;
      for (var i = 0; i < bucketContents.length; i++){
        var urlParams = {Bucket: bucketName, Key: bucketContents[i].Key};
          s3.getSignedUrl('getObject',urlParams, function(err, url){
            console.log('the url of the image is', url);
          });
      }
  });


  fs.readFile(fileName, function (err, data) {
    if (err) { throw err; }
  
    var base64data = new Buffer(data, 'binary');
  
    //var s3 = new AWS.S3();
    s3.putObject({
      Bucket: bucketName,
      Key: fileName,
      Body: base64data,
      ACL: 'public-read'
    },function (resp) {
      console.log(arguments);
      console.log('Successfully uploaded package.');
    });
  
  });


// var file = require('fs').createWriteStream('test_a.xlsx');
// s3.getObject(params).createReadStream().pipe(file);


