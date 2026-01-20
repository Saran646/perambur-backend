import * as XLSX from 'xlsx';
import * as path from 'path';

async function analyzeExcel() {
    try {
        const filePath = path.join(process.cwd(), 'PS4-Details.xlsx');
        console.log('Analyzing file:', filePath);

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            console.log('Excel file is empty.');
            return;
        }

        console.log('--- SHEET INFO ---');
        console.log('Sheet Name:', sheetName);
        console.log('Total Rows Found:', data.length);

        console.log('\n--- HEADERS FOUND ---');
        console.log(Object.keys(data[0] as any));

        console.log('\n--- DATA SAMPLE (Row 1) ---');
        console.log(JSON.stringify(data[0], null, 2));

    } catch (error) {
        console.error('Error analyzing Excel:', error);
    }
}

analyzeExcel();
