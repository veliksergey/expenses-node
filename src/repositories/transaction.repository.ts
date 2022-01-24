import {getRepository, ILike} from 'typeorm';
import {Transaction, Document} from '../models';
import {moveFile} from '../functions/files';
import {createDocument} from './document.repository';

export interface iItemPayload {id: number, name: string};
export interface iTransPayload {
  name: string,
  amount: number,
  relatedAmount: number,
  date: Date,
  relatedDate: Date,
  nonTaxable: boolean,
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

function prepareOrderByWay(orderBy: string, orderWay: string): any {
  const allowedOrders: Array<string> = ['id', 'name'];
  if (!allowedOrders.includes(orderBy)) orderBy = 'id';
  orderWay = orderWay.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return {[orderBy]: orderWay};
}

// ToDo: replace "any" with something better
// export const getTransactions = async():Promise<{transactions: Array<Transaction>, transactionCount: number}> => {
export const getTransactions = async (): Promise<any> => {
  const transRepo = getRepository(Transaction);

  const search: string = '';
  const order = prepareOrderByWay('date', 'DESC');
  const page: number = +'1';
  const take: number = Number('10'); // limit
  const skip: number = (page - 1) * take;

  // ToDo: search, pagination, etc
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
  if (search.trim()) {
    findOptions.where = [
      {name: ILike(`%${search}%`)},
      {project: {name: ILike(`%${search}%`)}},
      {vendor: {name: ILike(`%${search}%`)}},
    ];
  }

  const [result, total] = await transRepo.findAndCount({
    relations: ['account', 'category', 'person', 'project', 'vendor'],
    ...findOptions,
  });

  return {result, total};
};

export const getTransaction = async (id: number): Promise<Transaction | null> => {
  const transRepo = getRepository(Transaction);
  const trans = await transRepo.findOne({
    where: {id},
    relations: ['account', 'category', 'person', 'project', 'vendor']
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
    ...(transformTransaction(payload))
  });

  try {

    // save transaction
    const savedTrans = await transRepo.save(transCreated);

    // move file
    const fileInTemp = payload.fileInTemp;
    if (fileInTemp) {
      const onlyFileNameInTemp = fileInTemp.substring(fileInTemp.indexOf(".") + 1);
      const projectName = replaceInString(payload.project.name, '.', '_');
      const vendorName = replaceInString(payload.vendor.name, '.', '_');
      const amount = replaceInString(payload.amount, '.', '');
      let newFileName = `${savedTrans.id}.${projectName}.${vendorName}.${amount}.${onlyFileNameInTemp}`
        .trim().replace(/\s+/g, '_');
      const fileRes = moveFile({
        oldFolder: 'temp',
        oldFile: fileInTemp,
        newFolder: 't',
        newFile: newFileName
      });
      if (fileRes.errMsg) return {errMsg: fileRes.errMsg}

      // save document
      await createDocument({
        name: payload.fileName || onlyFileNameInTemp,
        path: fileRes.path,
        transactionId: savedTrans.id
      })
    }

    // get saved transaction from DB
    const transToReturn = await getTransaction(savedTrans.id);
    return transToReturn;

  } catch (err) {
    console.error(err);
    return {errMsg: 'Problem in saving transaction!'};
  }
};



// FUNCTIONS
function transformTransaction(trans: iTransPayload) {
  const {
    name, amount, relatedAmount, date, relatedDate, nonTaxable, notes, fileName, fileInTemp,
    accountId, categoryId, personId, projectId, vendorId,
    account, category, person, project, vendor
  } = trans;
  return {
    name, amount, relatedAmount, date, relatedDate, nonTaxable, notes,
    accountId, categoryId, personId, projectId, vendorId,
  };
}
function replaceInString(value: string | number, replaceWhat: string, replaceWith: string): string {
  // if (typeof value === 'number') value = value.toString();
  return value.toString().trim()
    .replace(/\s+/g, '_') // replaces spaces with "_"
    .split(replaceWhat).join(replaceWith);
}