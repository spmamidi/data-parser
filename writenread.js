var XLSX = require('xlsx');
var XLSX_CALC = require('xlsx-calc');
var Guid = require('guid');
var eol = require('eol');
var jsonfile = require('jsonfile');
var path = require('path');
// load your calc functions lib 
var formulajs = require('formulajs');

// import your calc functions lib 
XLSX_CALC.import_functions(formulajs);


var argFile = process.argv.slice(2)[0] || "test.xlsx";
var workbook = XLSX.readFile(argFile);
var workSheet = workbook.Sheets['SheetJS']; 
workSheet.B2.v = 10;
workSheet.B3.v = 20;
workSheet.B4.v = 30;
workSheet.C2.v = 50;
workSheet.C3.v = 40;
workSheet.C4.v = 60;


var XLSX_CALC = require('xlsx-calc');
XLSX_CALC(workbook);

var outputFileName = argFile.replace('.xlsx', '.json');
var errorsFileName = outputFileName.replace(".json", "errors.json");
//var fundings = XLSX.utils.sheet_to_json(workbook.Sheets["SheetJS"]);

var columNames = ["A",  "D", "E", "F"];
var rows = 4;
var fundings = [];
for(var i =1; i<=rows;i++){
    fundings.push({
        "id": workSheet["A"+i].v,
        "PG1":workSheet["D"+i].v,
        "PG2":workSheet["E"+i].v,
        "PG3":workSheet["F"+i].v,
        
    });
}
jsonfile.writeFileSync(outputFileName, fundings);

//jsonfile.writeFileSync(errorsFileName, errors);
console.log('successfully created', outputFileName);