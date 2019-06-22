require('dotenv').config()

var Excel = require('exceljs');
var workbook = new Excel.Workbook();
var not_allowed = [];

var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'blacklist.json');

fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
        not_allowed = JSON.parse(data);
    } else {
        console.log(err);
    }
});
// CONTROLLERS
const LABELS_COLUMN = process.env.LABELS_COLUMN
const DESCRIPTION_COLUMN = process.env.DESCRIPTION_COLUMN
const STORE_CLIENT_COLUMN = process.env.STORE_CLIENT_COLUMN
const CLIENTS_COLUMN = process.env.CLIENTS_COLUMN
const SOURCE_FILE = process.env.SOURCE_FILE
const OUTPUT_FILE = process.env.OUTPUT_FILE
const WORKSHEET = process.env.WORKSHEET
const STORE_SEVERITY_COLUNM = process.env.STORE_SEVERITY_COLUNM

//Summary for severities
const SEV_SUMMARY_LABELS = process.env.SEV_SUMMARY_LABELS
const SEV_SUMMARY_VALUES = process.env.SEV_SUMMARY_VALUES

// Summary for severities of clients
const SEV_SUMMARY_CLIENT_NAME = process.env.SEV_SUMMARY_CLIENT_NAME
const SEV_SUMMARY_CLIENT_SEV1 = process.env.SEV_SUMMARY_CLIENT_SEV1
const SEV_SUMMARY_CLIENT_SEV2 = process.env.SEV_SUMMARY_CLIENT_SEV2
const SEV_SUMMARY_CLIENT_SEV3 = process.env.SEV_SUMMARY_CLIENT_SEV3
const SEV_SUMMARY_CLIENT_SEV4 = process.env.SEV_SUMMARY_CLIENT_SEV4

// READ WORKBOOK
workbook.xlsx.readFile(SOURCE_FILE)
    .then(function () {
        var worksheet = workbook.getWorksheet(WORKSHEET);
        var i = 2;
        var total = 0;
        while (i <= worksheet.rowCount) {
            var valor_celula_p = worksheet.getCell(LABELS_COLUMN + i).value
            var k = 0;
            if (valor_celula_p != null) {
                while (k < not_allowed.length) {
                    valor_celula_p = valor_celula_p.toLowerCase().replace(not_allowed[k], "")
                    valor_celula_p = valor_celula_p.replace(" ,", "")
                    valor_celula_p = valor_celula_p.replace(", ", "")
                    valor_celula_p = valor_celula_p.trim()
                    k++;
                }
                worksheet.getCell(STORE_CLIENT_COLUMN + i).value = valor_celula_p.toUpperCase()
            }

            if (worksheet.getCell(STORE_CLIENT_COLUMN + i).value == worksheet.getCell("L" + i).value) {
                worksheet.getCell("AG" + i).fill = {
                    type: 'pattern',
                    pattern: 'darkTrellis',
                    fgColor: { argb: 'FFFFFF00' },
                    bgColor: { argb: 'FF0000FF' }
                };
            }

            i++;
        }
        console.log('finalizado!');
        return workbook.xlsx.writeFile(OUTPUT_FILE);
    })
