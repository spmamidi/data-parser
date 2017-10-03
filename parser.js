var XLSX = require('xlsx');
var Guid = require('guid');
var eol = require('eol');
var jsonfile = require('jsonfile');
var path = require('path');
function isValidNumber(number) {
    return !isNaN(number);
}
var ids = {};
var errors = [];

var argFile = process.argv.slice(2)[0] || "sample.xlsx";


var workbook = XLSX.readFile(argFile);
var toCustomObject = function (array) {
    return array.reduce((result, item) => {
        if (item) {
            result[item.id] = item;
        }
        return result;
    }, {});
}

/**
* getColumnFromIndex
* Helper that returns a column value (A-XFD) for an index value (integer).
* The column follows the Common Spreadsheet Format e.g., A, AA, AAA.
* See https://stackoverflow.com/questions/181596/how-to-convert-a-column-number-eg-127-into-an-excel-column-eg-aa/3444285#3444285
* @param numVal: Integer
* @return String
*/
function getColumnFromIndex(numVal) {
    var dividend = parseInt(numVal);
    var columnName = '';
    var modulo;
    while (dividend > 0) {
        modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + modulo) + columnName;
        dividend = parseInt((dividend - modulo) / 26);
    }
    return columnName;
}

/**
* getIndexFromColumn
* Helper that returns an index value (integer) for a column value (A-XFD).
* The column follows the Common Spreadsheet Format e.g., A, AA, AAA.
* See https://stackoverflow.com/questions/9905533/convert-excel-column-alphabet-e-g-aa-to-number-e-g-25
* @param strVal: String
* @return Integer
*/
function getIndexFromColumn(val) {
    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;
    for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
        result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
    }
    return result;
}

function parseSheet(sheetName, boundaries, configuration, workSheet) {
    return parseMatrix(boundaries, configuration, workSheet);

}

function parseMatrix(boundaries, configuration, workSheet) {
    var columns = getColumns(configuration.output.start.columnName, configuration.output.end.columnName, boundaries);
    var rows = getRows(configuration.output.start.row, boundaries.end.row, boundaries);
    var results = [];
    columns.forEach((column) => {
        rows.forEach((row) => {
            var mainValue = resolveValue(row, column, workSheet);
            if (mainValue) {
                var entity = {};
                entity[configuration.output.name] = mainValue;
                configuration.output.properties.forEach(property=>{
                    var propColumn = property.columnName === "=" ? column : getIndexFromColumn(property.columnName);
                    var propRow = property.row === "=" ? row : property.row;
                    entity[property.name] = resolveValue(propRow, propColumn, workSheet);
                });
                results.push(entity);
            }
        });
    });
   return results;
}

function resolveValue(row, column, workSheet) {
    var columnName = getColumnFromIndex(column);
    
    var value = workSheet[columnName + row] && workSheet[columnName + row].v || '';
    return value;
}
function getRows(start, end, boundaries) {
    if (end === "~") {
        end = +boundaries.end.row;
    }
    start = +start;
    end = +end;
    return Array.apply(start, Array(end - start + 1)).map(function (item, index) { return start + index; })
}
function getColumns(startColumnName, endColumnName, boundaries) {
    if (endColumnName === "~") {
        endColumnName = boundaries.end.columnName;
    }
    var start = getIndexFromColumn(startColumnName);
    var end = getIndexFromColumn(endColumnName);
    return Array.apply(start, Array(end - start + 1)).map(function (item, index) { return start + index; })
}


var configSettings = {
    pattern: "matrix",
    output: {
        name: "fundingAmount",
        start: {
            columnName: "D",
            row: "5"
        },
        end: {
            columnName: "~",
            row: "~"
        },
        properties: [{
            name: "recipientId",
            columnName: "A",
            row: "="
        },
        {
            name: "programId",
            columnName: "=",
            row: "2"
        },
        {
            name: "programName",
            columnName: "B",
            row: "="
        }

        ]
    }
}

//started processing
var fundings = workbook.SheetNames.map((sheetName) => {
    var workSheet = workbook.Sheets[sheetName];
    var rawJson = XLSX.utils.sheet_to_json(workSheet);
    var sheetBoundaries = workSheet['!ref'].split(":");

    var boundaries = {
        start: {
            row: sheetBoundaries[0].replace(/[A-Z]/g, ""),
            columnName: sheetBoundaries[0].replace(/[0-9]/g, ""),
            column: getIndexFromColumn(sheetBoundaries[0].replace(/[0-9]/g, ""))
        },
        end: {

            row: sheetBoundaries[1].replace(/[A-Z]/g, ""),
            columnName: sheetBoundaries[1].replace(/[0-9]/g, ""),
            column: getIndexFromColumn(sheetBoundaries[1].replace(/[0-9]/g, ""))

        }
    };
    return parseSheet(sheetName, boundaries,configSettings, workSheet );

});


var outputFileName = argFile.replace('.xlsx', '.json');
var errorsFileName = outputFileName.replace(".json", "errors.json");

jsonfile.writeFileSync(outputFileName, fundings);
jsonfile.writeFileSync(errorsFileName, errors);
console.log('successfully created', outputFileName);