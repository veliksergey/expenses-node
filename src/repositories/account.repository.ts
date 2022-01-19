import {getRepository} from 'typeorm';
import {Account} from '../models';

export interface AccountPayload {
  name: string,
}

export const getAccounts = async ():Promise<Array<Account>> => {
  return await getRepository(Account)
    .find();
}

export const getAccount = async (id: number):Promise<Account | null> => {
  const account = await getRepository(Account)
    .findOne(id);
  return account || null;
}

export const createAccount = async (payload: AccountPayload): Promise<Account> => {
  const account = new Account();
  return await getRepository(Account)
    .save({
      ...account,
      ...payload
    });
}