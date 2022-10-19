import XLSX from 'xlsx';

const wb = XLSX.readFile('chase.csv');
const sheetNameList = wb.SheetNames;
const xlData = XLSX.utils.sheet_to_json(wb.Sheets[sheetNameList[0]]);

console.log(xlData);