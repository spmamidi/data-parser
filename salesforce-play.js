var jsforce = require('jsforce');
var sfConfig = require('./salesforce-config.json')
var conn = new jsforce.Connection({loginUrl: sfConfig.serverUrl});
conn.login(sfConfig.userName, sfConfig.password, function(err, res) {
  if (err) { return console.error(err); }
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  
  var records = [];
  conn.query("SELECT Id, Name FROM Account", function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
  });
  // ..../
});