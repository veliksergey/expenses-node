import {getRepository, ILike, Raw} from 'typeorm';
import {Transaction} from '../models';
import {moveFile} from '../functions/files';
import {createDocument} from './document.repository';
import {createItem} from './item.repository';

export interface iItemPayload {id: number, name: string};
export interface iTransPayload {
  type: number,
  name: string,
  amount: number,
  relatedAmount: number | null,
  date: Date,
  relatedDate: Date | null,
  taxable: boolean,
  notes: string,
  projectId: number,
  vendorId: number,
  accountId: number,
  personId: number,
  categoryId: number,
  documents: Array<{ name: string, path: string }>,
  related: Array<any>,
  fileName: string,
  fileInTemp: string,
  account: iItemPayload,
  category: iItemPayload,
  person: iItemPayload,
  project: iItemPayload,
  vendor: iItemPayload,
}
interface queryPayload {page: number, rowsPerPage: number, sortBy: string, descending: boolean, filter: string};

function prepareOrder(sortBy: string, descending: boolean): any {
  const allowedOrders: Array<string> = ['id', 'name', 'amount', 'date',];
  sortBy = sortBy.toLowerCase();
  if (!allowedOrders.includes(sortBy)) sortBy = 'id';
  const sortWay = descending ? 'DESC' : 'ASC';
  return {[sortBy]: sortWay};
}

// ToDo: replace "any" with something better
// export const getTransactions = async():Promise<{transactions: Array<Transaction>, transactionCount: number}> => {
export const getTransactions = async (payload: queryPayload): Promise<any> => {
  const transRepo = getRepository(Transaction);

  const search: string = payload.filter;
  const order = prepareOrder(payload.sortBy, payload.descending);
  const take: number = payload.rowsPerPage; // limit
  const skip: number = (payload.page - 1) * take;

  /*return await transRepo.find({relations: ['project']});

  const [transactions, transactionCount] = await transRepo
    .findAndCount({relations: ['related']});

  return {transactions, transactionCount};

  const trans = await transRepo
    .createQueryBuilder('t')
    // .select(['t.id', 't.name', 't.amount', 't.date', 't.notes'])
    .leftJoinAndSelect('t.project', 'project')
    .leftJoinAndSelect('t.vendor', 'vendor')
    // .leftJoinAndSelect('t.related', 'transaction')
    .skip(skip) // pagination
    .take(take)
    .maxExecutionTime(5000) // limit of execution time to avoid a server crashing
    .printSql() // for debugging
    .getMany();*/

  let findOptions: any = {
    skip, take, order,
  };
  if (search.trim().length) {
    findOptions.where = [
      {name: ILike(`%${search}%`)},
      {project: {name: ILike(`%${search}%`)}},
      {vendor: {name: ILike(`%${search}%`)}},
      {account: {name: ILike(`%${search}%`)}},
      {category: {name: ILike(`%${search}%`)}},
    ];
    if (!isNaN(Number(search))) { // if search is number (for amount)
      findOptions.where.push({
        amount: Raw((alias) => `CAST(${alias} AS TEXT) LIKE :sa`, {sa: `${search}%`})
      })
    }
  }

  const [result, total] = await transRepo.findAndCount({
    relations: ['account', 'category', 'person', 'project', 'vendor', 'documents'],
    ...findOptions,
  });

  return {result, total};
};

export const getTransaction = async (id: number): Promise<Transaction | null> => {
  const transRepo = getRepository(Transaction);
  const trans = await transRepo.findOne({
    where: {id},
    relations: ['account', 'category', 'person', 'project', 'vendor', 'documents']
  });
  if (!trans) return null;
  return trans;
};

export const createTransaction = async (payload: iTransPayload): Promise<Transaction | { errMsg: string } | null> => {
  const transRepo = getRepository(Transaction);

  // create transaction
  const newTrans = new Transaction();
  const transCreated = transRepo.create({
    ...newTrans,
    ...(await prepareTransactionForDB(payload))
  });

  try {

    // save transaction
    const savedTrans = await transRepo.save(transCreated);
    console.log('*** savedTrans:', savedTrans);

    // move/create file/document
    await moveFileFromTempToUploads(savedTrans.id, {
      amount: savedTrans.amount,
      fileInTemp: payload.fileInTemp,
      fileName: payload.fileName,
      projectName: (typeof payload.project === 'object') ? payload.project.name : payload.project,
      vendorName: (typeof payload.vendor === 'object') ? payload.vendor.name : payload.vendor
    });

    return await getTransaction(savedTrans.id);

  } catch (err) {
    console.error(err);
    return {errMsg: 'Problem in saving transaction!'};
  }
};

export const updateTransaction = async (id: number, payload: iTransPayload): Promise<Transaction | {errMsg: string} | null> => {
  const transRepo = getRepository(Transaction);
  if (!id) return {errMsg: 'Missing transaction ID'};
  const trans: Transaction | undefined = await transRepo.findOne(id);
  if (!trans) return {errMsg: 'Cannot find a transaction to edit'};

  const t = await prepareTransactionForDB(payload);
  trans.type = t.type;
  trans.name = t.name;
  trans.amount = t.amount;
  trans.relatedAmount = t.relatedAmount;
  trans.date = t.date;
  trans.relatedDate = t.relatedDate;
  trans.taxable = t.taxable;
  trans.notes = t.notes;
  trans.accountId = t.accountId;
  trans.categoryId = payload.categoryId;
  trans.personId = payload.personId;
  trans.projectId = payload.projectId;
  trans.vendorId = payload.vendorId;
  trans.updatedAt = new Date();

  try {

    // save
    const savedTrans = await transRepo.save(trans);

    // move file/document from temp to uploads
    await moveFileFromTempToUploads(savedTrans.id, {
      amount: savedTrans.amount,
      fileInTemp: payload.fileInTemp,
      fileName: payload.fileName,
      projectName: (typeof payload.project === 'object') ? payload.project.name : payload.project,
      vendorName: (typeof payload.vendor === 'object') ? payload.vendor.name : payload.vendor
    });

    // return
    return await getTransaction(savedTrans.id);

  } catch (err) {
    console.error(err);
    return {errMsg: 'Error in editing transaction!'};
  }
}

async function moveFileFromTempToUploads (transId: number, payload:
    {fileInTemp: string, fileName: string, projectName: string, vendorName: string, amount: number}) {
  const fileInTemp = payload.fileInTemp;
  if (fileInTemp) {
    const onlyFileNameInTemp = fileInTemp.substring(fileInTemp.indexOf(".") + 1);
    const projectName = replaceInString(payload.projectName, '.', '_');
    const vendorName = replaceInString(payload.vendorName, '.', '_');
    const amount = replaceInString(payload.amount, '.', '');
    let newFileName = `${transId}.${projectName}.${vendorName}.${amount}.${onlyFileNameInTemp}`
      .trim().replace(/\s+/g, '_');
    const fileRes = moveFile({
      oldFolder: 'temp',
      oldFile: fileInTemp,
      newFolder: 't',
      newFile: newFileName
    });
    if (fileRes.errMsg) return {errMsg: fileRes.errMsg}

    // create document
    await createDocument({
      name: payload.fileName || onlyFileNameInTemp,
      path: fileRes.path,
      transactionId: transId
    })
  }
}



// FUNCTIONS
async function prepareTransactionForDB(trans: iTransPayload) {
  let {
    type, name, amount, relatedAmount, date, relatedDate, taxable, notes, fileName, fileInTemp,
    // accountId, categoryId, personId, projectId, vendorId,
    account, category, person, project, vendor} = trans;

  let accountId = !account ? null : (typeof account === 'object') ? account.id : (await createItem('account', {name: account})).id;
  let categoryId = !category ? null : (typeof category === 'object') ? category.id : (await createItem('category', {name: category})).id;
  let personId = !person ? null : (typeof person === 'object') ? person.id : (await createItem('person', {name: person})).id;
  const projectId = !project ? null : (typeof project === 'object') ? project.id : (await createItem('project', {name: project})).id;
  const vendorId = !vendor ? null : (typeof vendor === 'object') ? vendor.id : (await createItem('vendor', {name: vendor})).id;

  if (!relatedDate) relatedDate = null;
  if (!relatedAmount) relatedAmount = null;
  if (!accountId) accountId = null;
  if (!categoryId) categoryId = null;
  if (!personId) personId = null;

  return {
    type, name, amount, relatedAmount, date, relatedDate, taxable, notes,
    accountId, categoryId, personId, projectId, vendorId,
  };
}
function replaceInString(value: string | number, replaceWhat: string, replaceWith: string): string {
  // if (typeof value === 'number') value = value.toString();
  return value.toString().trim()
    .replace(/\s+/g, '_') // replaces spaces with "_"
    .split(replaceWhat).join(replaceWith);
}