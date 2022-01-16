import {getRepository, ILike} from 'typeorm';
import {Transaction} from '../models';

export interface iTransPayload {
  transName: string,
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
  catId: number,
  docs: Array<{docName: string, docLink: string}>,
  related: Array<any>,
}

function prepareOrderByWay(orderBy: string, orderWay: string): any {
  const allowedOrders: Array<string> = ['id', 'transName'];
  if (!allowedOrders.includes(orderBy)) orderBy = 'id';
  orderWay = orderWay.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return {[orderBy]: orderWay};
}

// ToDo: replace "any" with something better
// export const getTransactions = async():Promise<{transactions: Array<Transaction>, transactionCount: number}> => {
export const getTransactions = async (): Promise<any> => {
  const transRepo = getRepository(Transaction);

  const search: string = '';
  const order = prepareOrderByWay('transName', 'ASC');
  const page: number = +'1';
  const take: number = Number('10'); // limit
  const skip: number = (page - 1) * take;

  // ToDo: search, pagination, etc
  // return await transRepo.find({relations: ['project']});

  // const [transactions, transactionCount] = await transRepo
  //   .findAndCount({relations: ['related']});
  //
  // return {transactions, transactionCount};

  // const trans = await transRepo
  //   .createQueryBuilder('t')
  //   // .select(['t.id', 't.transName', 't.amount', 't.date', 't.notes'])
  //   .leftJoinAndSelect('t.project', 'project')
  //   .leftJoinAndSelect('t.vendor', 'vendor')
  //   // .leftJoinAndSelect('t.related', 'transaction')
  //   .skip(skip) // pagination
  //   .take(take)
  //   .maxExecutionTime(5000) // limit of execution time to avoid a server crashing
  //   .printSql() // for debugging
  //   .getMany();

  let findOptions: any = {
    skip, take, order,
  };
  if (search.trim()) {
    findOptions.where = [
      {transName: ILike(`%${search}%`)},
      {project: {projectName: ILike(`%${search}%`)}},
      {vendor: {vendorName: ILike(`%${search}%`)}},
    ];
  }

  const [result, total] = await transRepo.findAndCount({
    relations: ['account', 'cat', 'person', 'project', 'vendor'],
    ...findOptions,
  });

  return {result, total};
};

export const getTransaction = async (id: number): Promise<Transaction | null> => {
  const transRepo = getRepository(Transaction);
  const trans = await transRepo.findOne({id});
  console.log('-- trans:', trans);
  if (!trans) return null;
  return trans;
};

export const createTransaction = async (payload: iTransPayload): Promise<Transaction> => {
  const transRepo = getRepository(Transaction);
  const trans = new Transaction();

  // ToDo: get it from DB
  return transRepo.save({
    ...trans,
    ...payload
  });
};