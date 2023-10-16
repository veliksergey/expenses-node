import {getRepository, Not, Raw} from 'typeorm';
import {Transaction, Vendor} from '../models';

interface iQueryPayload {
  projectId: number,
  categoryId: number,
  year: string,
  groupBy: string,
  condition1Id: 'false' | 'true' | 'all',
  excludeLoans: string,
}

const relationTables = ['account', 'category', 'person', 'project', 'vendor', 'documents'];

export const getReport = async (payload: iQueryPayload): Promise<any> => {
  const transRepo = getRepository(Transaction);

  console.log('-- payload:', payload);

  const projectId = payload.projectId;
  const categoryId = payload.categoryId;
  const year = payload.year;
  // const groupBy = payload.groupBy;
  const groupBy = 'category'; // Todo
  const condition1Id = payload.condition1Id;
  const excludeLoans = payload.excludeLoans === 'true';
  const LOAN_PAYMENT_CATEGORY_ID = process.env.LOAN_PAYMENT_CATEGORY_ID || 0;

  let transactions = await transRepo.find({
    relations: relationTables,
    order: {date: 'DESC'},
    where: ((qb: any) => {
      qb.where({projectId})
          // .andWhere({condition1: Not(true)}) // tax condition (with partner or just myself)

      if (categoryId) qb.andWhere({categoryId});
      if (year) qb.andWhere(({date: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = ${year}`)}));
      // ToDo: GroupBy
      if (['true', 'false'].includes(condition1Id)) qb.andWhere({condition1: condition1Id === 'true'});
      if (excludeLoans) qb.andWhere({categoryId: Not(LOAN_PAYMENT_CATEGORY_ID)});
    })
  });

  transactions = transactions.map(t => {
    return {
      ...t,
      accountName: t.account?.name || '',
      categoryName: t.category?.name || '',
      personName: t.person?.name || '',
      projectName: t.project?.name || '',
      vendorName: t.vendor?.name || '',
    };
  });

  // brake by categories
  let resultObj: any = {};
  transactions.forEach((t: any) => {

    // for one table
    const title = 'All';
    if (resultObj[title]) resultObj[title].push(t);
    else resultObj[title] = [t];


    // table title
    /*let title;
    if (t.reportCondition) title = 'REPORT_CONDITION';
    else if (groupBy) title = t[groupBy]?.name || 'NULL';
    else title = 'transactions';

    if (resultObj[title]) {
      resultObj[title].push(t);
    } else {
      resultObj[title] = [t];
    }*/

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
