import {getRepository, ILike, Raw, Not} from 'typeorm';
import {Transaction} from '../models';
import {moveFile} from '../functions/files';
import {createDocument} from './document.repository';
import {createItem} from './item.repository';

const relationTables = ['account', 'category', 'person', 'project', 'vendor', 'documents'];

export interface iItemPayload {id: number, name: string};
export interface iTransPayload {
  type: number,
  name: string,
  amount: number,
  relatedAmount: number | null,
  date: Date,
  relatedDate: Date | null,
  notes: string,
  documents: Array<{ name: string, path: string }>,
  fileName: string,
  fileInTemp: string,
  account: iItemPayload | string,
  category: iItemPayload | string,
  person: iItemPayload | string,
  project: iItemPayload | string,
  vendor: iItemPayload | string,
  accountId: number,
  categoryId: number,
  personId: number,
  projectId: number,
  vendorId: number,
  condition1: boolean,
}
interface iQueryPayload {
  page: number,
  rowsPerPage: number,
  sortBy: string,
  descending: boolean,
  search: string,
  filters: string,
}
interface TransactionFilters {
  accountId: number;
  categoryId: number;
  personId: number;
  projectId: number;
  vendorId: number;
  date: string;
  dateFrom: string;
  dateTo: string;
  year: string;
  type: number;
  condition1Id: 'false' | 'true';
  excludeLoans: string }

function prepareOrder(sortBy: string, descending: boolean): any {
  // return {project: {name: 'ASC'}};
  const allowedOrders: Array<string> = ['id', 'name', 'amount', 'date',];
  sortBy = sortBy.toLowerCase();
  if (!allowedOrders.includes(sortBy)) sortBy = 'id';
  const sortWay = descending ? 'DESC' : 'ASC';
  const order = {[sortBy]: sortWay};
  if (sortBy !== 'id') order.id = 'DESC';
  return order;
}

// ToDo: replace "any" with something better
// export const getTransactions = async():Promise<{transactions: Array<Transaction>, transactionCount: number}> => {
export const getTransactions = async (payload: iQueryPayload): Promise<any> => {
  const transRepo = getRepository(Transaction);

  const search: string = payload.search;
  const order = prepareOrder(payload.sortBy, payload.descending);
  const take: number = payload.rowsPerPage; // limit
  const skip: number = (payload.page - 1) * take;
  const filters: TransactionFilters = JSON.parse(payload.filters);

  let findOptions: any = {skip, take, order,};

  const [result, total] = await transRepo.findAndCount({
    relations: relationTables,
    ...findOptions,
    where: ((qb: any) => {
      qb.where({deletedAt: null})
      // qb.andWhere({date: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = '2021'`)});

      // search
      if (search.trim().length) {
        qb.andWhere((qq: any) => {
          qq.where([
            {name: ILike(`%${search}%`)},
            {notes: ILike(`%${search}%`)},
            {project: {name: ILike(`%${search}%`)}},
            {vendor: {name: ILike(`%${search}%`)}},
            {account: {name: ILike(`%${search}%`)}},
            {category: {name: ILike(`%${search}%`)}},
            {person: {name: ILike(`%${search}%`)}},
          ]);
          if (!isNaN(Number(search))) { // if number -> search in amounts
            // if (search.indexOf('.') === -1) qq.orWhere({id: search});
            const searchWithDot = +search / 100;
            qq.orWhere({amount: Raw((alias) => `CAST(${alias} AS TEXT) LIKE :sa OR CAST(${alias} AS TEXT) LIKE :sw`, {sa: `${search}%`, sw: `${searchWithDot}%`})});
            qq.orWhere({relatedAmount: Raw((alias) => `CAST(${alias} AS TEXT) LIKE :sa OR CAST(${alias} AS TEXT) LIKE :sw`, {sa: `${search}%`, sw: `${searchWithDot}%`})});
            // if ((search).length > 2 && !(search).toString().includes('.')) {
            //   const searchWithDot = +search / 100;
            //   console.log('=================');
            //   console.log(searchWithDot);
            //   console.log('=================');
            //   qq.orWhere({amount: Raw((alias) => `CAST(${alias} AS TEXT) LIKE :sa`, {sa: `${searchWithDot}%`})});
            //   qq.orWhere({relatedAmount: Raw((alias) => `CAST(${alias} AS TEXT) LIKE :sa`, {sa: `${searchWithDot}%`})});
            // }
          }
        });
      }

      // filters
      if (filters && Object.keys(filters).length) {
        if (filters.accountId) qb.andWhere({accountId: filters.accountId});
        if (filters.categoryId) qb.andWhere({categoryId: filters.categoryId});
        if (filters.personId) qb.andWhere({personId: filters.personId});
        if (filters.projectId) qb.andWhere({projectId: filters.projectId});
        if (filters.vendorId) qb.andWhere({vendorId: filters.vendorId});
        if (filters.type) qb.andWhere({type: filters.type});
        if (filters.date) qb.andWhere({date: filters.date});
        if (filters.dateFrom) qb.andWhere('date >= :dateFrom', {dateFrom: filters.dateFrom});
        if (filters.dateTo) qb.andWhere('date <= :dateTo', {dateTo: filters.dateTo});
        if (filters.year) qb.andWhere({date: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = '${filters.year}'`)});
        if (['true', 'false'].includes(filters.condition1Id)) {
          const condition = filters.condition1Id === 'true';
          qb.andWhere({condition1: condition});
        }
        if (filters.excludeLoans === 'true') {
          const LOAN_PAYMENT_CATEGORY_ID = process.env.LOAN_PAYMENT_CATEGORY_ID || 0;
          qb.andWhere({categoryId: Not(LOAN_PAYMENT_CATEGORY_ID)})
        }
      }

    }),
  });

  return {result, total};
};

export const getPossibleDuplicates = async ({date, relatedDate, amount, relatedAmount, id}
                                            : {date: string, relatedDate: string, amount: string, relatedAmount: string, id: string}): Promise<{result: Array<Transaction>, total: number}> => {
  const transRepo = getRepository(Transaction);

  // date: Raw((alias) => `EXTRACT (YEAR FROM ${alias}) = '${year}' AND EXTRACT (MONTH FROM ${alias}) = '${month}'`),
  /*const where: any = [
    {date, amount},
    {date, amount: relatedAmount},
    {date: relatedDate, amount: relatedAmount},
    {relatedDate: date, amount},
    {relatedDate: date, amount: relatedAmount},
    {relatedDate: date, relatedAmount: relatedAmount},
  ];
  if (id && id !== 'null' && id !== 'undefined') {
    where.forEach((wh: any) => wh.id = Not(+id));
  }*/

  const whereObj: any= {date, amount};
  let whereDate = `"date" = :date OR "relatedDate" = :date`;
  if (relatedDate) {
    whereDate += ` OR "date" = :relatedDate OR "relatedDate" = :relatedDate`;
    whereObj.relatedDate = relatedDate;
  }
  let whereAmount = `"amount" = :amount OR "relatedAmount" = :amount`;
  if (relatedAmount) {
    whereAmount += ` OR "amount" = :relatedAmount OR "relatedAmount" = :relatedAmount`;
    whereObj.relatedAmount = relatedAmount;
  }

  const [result, total] = await transRepo.findAndCount({
    relations: relationTables,
    // where,
    where: ((qb: any) => {
      qb.where(`(${whereDate}) AND (${whereAmount})`, whereObj)
    })
  });

  return {result, total};
}

export const getTransaction = async (id: number): Promise<Transaction | null> => {
  const transRepo = getRepository(Transaction);
  const trans = await transRepo.findOne({
    where: {id},
    relations: relationTables
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
    ...(await prepareTransactionForDB(payload)),
  });

  try {

    // save transaction
    const savedTrans = await transRepo.save(transCreated);

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
  trans.notes = t.notes;
  trans.accountId = t.accountId;
  trans.categoryId = t.categoryId;
  trans.personId = t.personId;
  trans.projectId = t.projectId;
  trans.vendorId = t.vendorId;
  trans.updatedAt = new Date();
  trans.condition1 = t.condition1;

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

export const setCondition1 = async (id: number, payload: {condition: boolean}): Promise<Transaction | {errMsg: string} | null> => {
  const transRepo = getRepository(Transaction);
  if (!id) return {errMsg: 'Missing transaction ID'};
  const trans: Transaction | undefined = await transRepo.findOne(id);
  if (!trans) return {errMsg: 'Cannot find a transaction to edit'};

  trans.condition1 = payload.condition === true ? true : false;

  try {
    const savedTrans = await transRepo.save(trans);
    return await getTransaction(savedTrans.id);
  } catch (err) {
    console.error(err);
    return {errMsg: 'Error in setting condition1'};
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
    type, name, amount, relatedAmount, date, relatedDate, notes, fileName, fileInTemp, condition1,
    // accountId, categoryId, personId, projectId, vendorId,
    account, category, person, project, vendor} = trans;

  let accountId = !account ? null : (typeof account === 'object') ? account.id : (await createItem('account', {name: account})).id;
  let categoryId = !category ? null : (typeof category === 'object') ? category.id : (await createItem('category', {name: category})).id;
  let personId = !person ? null : (typeof person === 'object') ? person.id : (await createItem('person', {name: person})).id;
  let projectId = !project ? null : (typeof project === 'object') ? project.id : (await createItem('project', {name: project})).id;
  let vendorId = !vendor ? null : (typeof vendor === 'object') ? vendor.id : (await createItem('vendor', {name: vendor})).id;

  condition1 = !!condition1;
  if (!relatedDate) relatedDate = null;
  if (!relatedAmount) relatedAmount = null;
  if (!accountId) accountId = null;
  if (!categoryId) categoryId = null;
  if (!personId) personId = null;
  if (!projectId) projectId = null;
  if (!vendorId) vendorId = null;

  return {
    type, name, amount, relatedAmount, date, relatedDate, notes, condition1,
    accountId, categoryId, personId, projectId, vendorId,
  };
}
function replaceInString(value: string | number, replaceWhat: string, replaceWith: string): string {
  // if (typeof value === 'number') value = value.toString();
  return value.toString().trim()
    .replace(/\s+/g, '_') // replaces spaces with "_"
    .split(replaceWhat).join(replaceWith);
}
