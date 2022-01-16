import {getRepository} from 'typeorm';
import {Cat} from '../models';

export interface iCatPayload {
  catName: string,
  catType: number,
}

export const getCats = async (): Promise<Array<Cat>> => {
  const catRepo = getRepository(Cat);
  return catRepo.find();
};

export const getCat = async (id: number): Promise<Cat | null> => {
  const catRepo = getRepository(Cat);
  const cat = await catRepo.findOne({id: id});
  if (!cat) return null;
  return cat;
};

export const createCat = async (payload: iCatPayload): Promise<Cat> => {
  const catRepo = getRepository(Cat);
  const cat = new Cat();
  return catRepo.save({
    ...cat,
    ...payload
  });
};