    const xlsx = require('xlsx');
    const path = require('path');

    class ExcelService {
        static readExcelData(filePath) {
            try {
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
                const headers = data[0];
                const rows = data.slice(1);

                return rows.map(row => {
                    let rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header.trim()] = row[index] ? row[index].trim() : '';
                    });
                    return rowData;
                });
            } catch (error) {
                console.error('Error reading Excel file:', error.message);
                throw new Error('Error reading Excel file');
            }
        }
    }

    module.exports = ExcelService;
