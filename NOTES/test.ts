import {createConnection, getRepository, Raw} from 'typeorm';
import dbConfig from '../ormconfig';
import {Transaction} from '../src/models';

const date = '2022-02-07';
const amount = '5.88';
// const relatedDate = '2021-01-27';
const relatedDate = '';
// const relatedAmount = '279.62';
const relatedAmount = '';


createConnection(dbConfig).then(connection => {
  console.log('-- Connection established');

  const transRepo = getRepository(Transaction);

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

  const field = "id"

  transRepo.findAndCount({
    relations: ['account', 'category', 'person', 'project', 'vendor', 'documents'],
    // where: ((qb: any) => {
    //   qb.where(`(${whereDate}) AND (${whereAmount})`, whereObj)
    // }),
    order: {id: 'DESC'}
  }).then((rr) => {
    console.log(rr[0].length);

    process.exit(1);
  })

}).catch(err => {
  console.error('Unable to connect to db', err);
  process.exit(1);
});