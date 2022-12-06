import {getRepository, Not, Raw} from 'typeorm';
import {Transaction, Vendor} from '../models';

interface iQueryPayload {
  accountId: number,
  categoryId: number,
  personId: number,
  projectId: number,
  vendorId: number,
  groupBy: string,
}

const relationTables = ['account', 'category', 'person', 'project', 'vendor', 'documents'];

export const getReport = async (payload: iQueryPayload): Promise<any> => {
  const transRepo = getRepository(Transaction);

  const projectId = payload.projectId;
  const accountId = payload.accountId;
  const categoryId = payload.categoryId;
  const personId = payload.personId;
  const vendorId = payload.vendorId;
  const groupBy = payload.groupBy;
  const LOAN_PAYMENT_CATEGORY_ID = process.env.LOAN_PAYMENT_CATEGORY_ID || 0;

  let transactions = await transRepo.find({
    relations: relationTables,
    order: {date: 'DESC'},
    where: ((qb: any) => {
      qb.where({projectId})
          .andWhere({categoryId: Not(LOAN_PAYMENT_CATEGORY_ID)});
      // qb.andWhere({date: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = '2021'`)});

      if (accountId) qb.andWhere({accountId});
      if (categoryId) qb.andWhere({categoryId});
      if (personId) qb.andWhere({personId});
      if (vendorId) qb.andWhere({vendorId});
    })
  });

  transactions = transactions.map(t => {
    return {
      ...t,
      amount: t.type === 1 ? -Math.abs(t.amount) : t.amount, // ToDo: ToChange
      accountName: t.account?.name || '',
      categoryName: t.category?.name || '',
      personName: t.person?.name || '',
      projectName: t.project?.name || '',
      vendorName: t.vendor?.name || '',
    };
  });

  let resultObj: any = {};

  transactions.forEach((t: any) => {

    // table title
    let title;
    if (t.reportCondition) title = 'REPORT_CONDITION';
    else if (groupBy) title = t[groupBy]?.name || 'NULL';
    else title = 'transactions';

    if (resultObj[title]) {
      resultObj[title].push(t);
    } else {
      resultObj[title] = [t];
    }

  });


  /*if (groupBy) {
    transactions.forEach((t: any) => {

      // check for report condition
      const title = t.reportCondition ? 'REPORT CONDITION' : t[groupBy]?.name || 'NULL';

      if (resultObj[title]) {
        resultObj[title].push(t);
      } else {
        resultObj[title] = [t];
      }

    })
  } else {
    resultObj = {transactions}
  }*/

  return resultObj;
}
