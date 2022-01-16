import {getRepository} from 'typeorm';
import {Doc} from '../models';

export interface iDocPayload {
  docName: string,
  docLink: string,
  transactionId: number,
}

export const getDocs = async (transactionId: number): Promise<Array<Doc>> => {
  const docRepo = getRepository(Doc);
  return docRepo.find({
    where: {transactionId}
  });
};

// export const getDoc = async (id: number): Promise<Doc | null> => {
//   const docRepo = getRepository(Doc);
//   const doc = await docRepo.findOne({id: id});
//   if (!doc) return null;
//   return doc;
// };


// ToDo: work on upload docs
export const createDoc = async (payload: iDocPayload): Promise<Doc> => {
  const docRepo = getRepository(Doc);
  const doc = new Doc();
  return docRepo.save({
    ...doc,
    ...payload
  });
};