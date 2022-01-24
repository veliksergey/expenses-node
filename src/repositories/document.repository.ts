import {getRepository} from 'typeorm';
import {Document} from '../models';

export interface iDocPayload {
  name: string,
  path: string,
  transactionId: number,
}

export const getDocuments = async (transactionId: number): Promise<Array<Document>> => {
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


export const createDocument = async (payload: iDocPayload): Promise<Document> => {
  const docRepo = getRepository(Document);
  const document = new Document();
  return docRepo.save({
    ...document,
    ...payload
  });
};