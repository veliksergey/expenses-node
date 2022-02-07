import {createConnection} from 'typeorm';
import dbConfig from '../ormconfig';
import {getRepository} from 'typeorm';
import {Transaction, Account, Category, Person, Project, Vendor, Document} from '../src/models';
import XLSX from 'xlsx';
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const shell = require('shelljs');

const tables = ['account', 'category', 'person', 'project', 'vendor', 'transaction', 'document'];

// create "backups" folder if doesn't exist
const backupPath = path.join(__dirname, 'backups');
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath);
  console.log(`-- Created "backups" folder`);
}

// create DB connection
createConnection(dbConfig)
.then(async conn => {
  console.log('-- Connection established');

  // repo promises
  const repoPromises: any = [];
  tables.forEach(table => {
    const repo = getRepo(table);
    repoPromises.push(repo.find());
  });

  // values from DB tables
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

  // create folder in "backup"
  const t = new Date();
  const date = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  const time = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}`;
  const folderPath = path.join(__dirname, 'backups', date);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`-- Created folder "${date}" in "backups"`);
  }

  // write EXCEL file
  const excelFileName = `${time}.xlsx`;
  const excelFilePath = path.join(folderPath, excelFileName);
  XLSX.writeFile(workBook, excelFilePath);
  // console.log(`-- Created file "${excelFileName}" in "backups/${date}"`);
  console.log('-- EXCEL file created');

  // write JSON file
  const jsonFileName = `${time}.json`;
  const jsonFilePath = path.join(folderPath, jsonFileName);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj));
  // console.log(`-- Created file "${jsonFileName}" in "backups/${date}"`);
  console.log('-- JSON file created');

  // dump the whole DB
  shell.exec(`PGPASSWORD="postgres" pg_dump --file "${folderPath}/DB_BACKUP" --format=c --blobs --host localhost --user postgres --encoding "UTF8" "expenses"`);
  console.log('-- DB backup (dump) completed');

  // copy "uploads" to "backups"
  copyFolderRecursiveSync('../uploads', folderPath);
  console.log('-- Copied "uploads" folder');

  // zip "backups" folder
  const zipFolderName = `EXPENSES_BACKUP_FILES_${date}_${time}.zip`;
  const zipPath = path.join(__dirname, zipFolderName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {zlib: {level: 9}});
  output.on('close', () => {

    console.log(`-- Created ZIP folder weights ${archive.pointer()} bytes`);

    // move zip folder to Documents
    let documentPath = '/home/serqio/Documents';
    const finalFolder = path.join(documentPath, 'BACKUPS')
    if (!fs.existsSync(finalFolder)) {
      fs.mkdirSync(finalFolder);
      console.log(`-- Created dir "${finalFolder}"`);
    }
    const finalPath = path.join(finalFolder, zipFolderName);
    fs.renameSync(zipPath, finalPath);
    console.log('-- Moved ZIP folder to Documents');

    // delete "backups" folder
    fs.rmdirSync(backupPath, {recursive: true});
    console.log('-- Deleted "backups" folder');

    console.log('-- DONE');

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
});


function getModel (table: string) {
  if (table === 'account' || table === 'accounts') return Account;
  if (table === 'category' || table === 'categories') return Category;
  if (table === 'person' || table === 'people') return Person;
  if (table === 'project' || table === 'projects') return Project;
  if (table === 'vendor' || table === 'vendors') return Vendor;
  if (table === 'transaction' || table === 'transactions') return Transaction;
  if (table === 'document' || table === 'documents') return Document;
  return Transaction;
}
function getRepo (table: string) {
  return getRepository(getModel(table));
}

// @ts-ignore
function copyFolderRecursiveSync(source, target) {
  let files = [];
  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    // @ts-ignore
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

// @ts-ignore
function copyFileSync( source, target ) {
  let targetFile = target;
  // If target is a directory, a new file with the same name will be created
  if ( fs.existsSync( target ) ) {
    if ( fs.lstatSync( target ).isDirectory() ) {
      targetFile = path.join( target, path.basename( source ) );
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}