var XLSX = require('xlsx');
var XLSX_CALC = require('xlsx-calc');
var Guid = require('guid');
var eol = require('eol');
var jsonfile = require('jsonfile');
var path = require('path');
// load your calc functions lib 
var formulajs = require('formulajs');
//https://govgrants8605.blob.core.windows.net/azure-webjobs-hosts/sample.xlsx
// import your calc functions lib 
XLSX_CALC.import_functions(formulajs);
var http = require('https');
var url = process.argv[2] || 'https://govgrants8605.blob.core.windows.net/azure-webjobs-hosts/sample.xlsx';
var request = require('request');
request.responseType = "arraybuffer";
if (url) {

    // http.get(url, function (res) {
    //     var data = [];

    //     res.on('data', function (chunk) {
    //         data.push(chunk);
    //     }).on('end', function () {
    //         //at this point data is an array of Buffers
    //         //so Buffer.concat() can make us a new Buffer
    //         //of all of them together
    //         var buffer = Buffer.concat(data);
    //         var workbook = XLSX.read(buffer, { type: "buffer" });

    //     });
    // });

    // request(url, function (error, response, body) {
    //   console.log('error:', error); // Print the error if one occurred
    //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //   console.log('body:', body); // Print the HTML for the Google homepage.
    //   //var data = new Uint8Array(body);

    //   // var binary = "";
    //   // var bytes = new Uint8Array(body);
    //   // var length = bytes.byteLength;
    //   // for (var i = 0; i < length; i++) {
    //   //   binary += String.fromCharCode(bytes[i]);
    //   // }

    //   // var workbook = XLSX.read(binary, {type:"binary"});
    //   var workbook = XLSX.read(body, {type:"binary"});

    // });
    http.get(url, function (res) {
        var body = '';
        res.on('error', function (err) {
            console.error(err);
        })
        res.on('data', function (chunk) {
            body += chunk.toString();
        });
        res.on('end', function () {
            console.log(body.length);
            console.log(body);
            var workbook = XLSX.read(body, {type:"binary"});


        });

        //fileService.createReadStream(shareName, directoryName, fileName).pipe(writable);
    }); 
}
