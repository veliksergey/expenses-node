import {createConnection} from 'typeorm';
import dbConfig from '../ormconfig';
import {getRepository} from 'typeorm';
import {Transaction, Account, Category, Person, Project, Vendor, Document} from '../src/models';
import XLSX from 'xlsx';
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const tables = ['account', 'category', 'person', 'project', 'vendor', 'transaction', 'document'];

const getModel = (table: string) => {
  let model: any = Transaction;
  switch (table) {
    case 'account':
      model = Account;
      break;
    case 'category':
      model = Category;
      break;
    case 'person':
      model = Person;
      break;
    case 'project':
      model = Project;
      break;
    case 'vendor':
      model = Vendor;
      break;
    case 'transaction':
      model = Transaction;
      break;
    case 'document':
      model = Document;
      break;
    default:
      model = Transaction;
  }
  return model;
}
const getRepo = (table: string) => {
  return getRepository(getModel(table));
}

// create "backups" folder if doesn't exist
const backupPath = path.join(__dirname, 'backups');
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath);
  console.log(`Created "backups" folder`);
}

createConnection(dbConfig)
.then(async conn => {
  console.log('Connection established');

  // repo promises
  const repoPromises: any = [];
  tables.forEach(table => {
    const repo = getRepo(table);
    repoPromises.push(repo.find());
  });

  // values
  const jsonObj: any = {};
  const values = await Promise.all(repoPromises);
  const workBook = XLSX.utils.book_new();
  tables.forEach((table, idx) => {

    // EXCEL
    const workSheet = XLSX.utils.json_to_sheet(values[idx]);
    XLSX.utils.book_append_sheet(workBook, workSheet, table);

    // JSON
    jsonObj[table] = values[idx];
  });

  // folder
  const t = new Date();
  const date = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  const time = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}`;
  const folderPath = path.join(__dirname, 'backups', date);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Created folder "${date}" in "backups"`);
  }

  // EXCEL file
  const excelFileName = `${time}.xlsx`;
  const excelFilePath = path.join(folderPath, excelFileName);
  XLSX.writeFile(workBook, excelFilePath);
  console.log(`Created file "${excelFileName}" in "backups/${date}"`);

  // JSON file
  const jsonFileName = `${time}.json`;
  const jsonFilePath = path.join(folderPath, jsonFileName);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj));
  console.log(`Created file "${jsonFileName}" in "backups/${date}"`);


  // zip backups folder
  const zipFolderName = `EXPENSES_BACKUP_FILES_${date}_${time}.zip`;
  const zipPath = path.join(__dirname, zipFolderName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {zlib: {level: 9}});
  output.on('close', () => {

    console.log(`Created ZIP folder weights ${archive.pointer()} bytes`);

    // move zip folder to Documents
    let documentPath = '/home/serqio/Documents';
    const finalFolder = path.join(documentPath, 'BACKUPS')
    if (!fs.existsSync(finalFolder)) {
      fs.mkdirSync(finalFolder);
      console.log(`Created dir "${finalFolder}"`);
    }
    const finalPath = path.join(finalFolder, zipFolderName);
    fs.renameSync(zipPath, finalPath);
    console.log(`Moved ZIP folder to "${finalFolder}"`);

    // delete "backups" folder
    fs.rmdirSync(backupPath, {recursive: true});
    console.log('Deleted "backups" folder');

    // exit the script
    process.exit(1);

  });
  archive.on('warning', (err: any) => {
    if (err.code === 'ENOENT') console.warn(err);
    else throw err;
  });
  archive.on('error', (err: any) => {throw err;});
  archive.pipe(output);
  archive.directory('backups/', false);
  archive.finalize();

}).catch(err => {
  console.error(err);
})