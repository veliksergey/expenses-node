import {getRepository} from 'typeorm';
import {Document} from '../models';

export interface iDocPayload {
  name: string,
  link: string,
  transactionId: number,
}

export const getDocs = async (transactionId: number): Promise<Array<Document>> => {
  const docRepo = getRepository(Document);
  return docRepo.find({
    where: {transactionId}
  });
};

// export const getDoc = async (id: number): Promise<Doc | null> => {
//   const docRepo = getRepository(Doc);
//   const document = await docRepo.findOne({id: id});
//   if (!document) return null;
//   return document;
// };


// ToDo: work on upload documents
export const createDoc = async (payload: iDocPayload): Promise<Document> => {
  const docRepo = getRepository(Document);
  const document = new Document();
  return docRepo.save({
    ...document,
    ...payload
  });
};