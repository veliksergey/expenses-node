import {getRepository} from 'typeorm';
import {Category} from '../models';

export interface iCatPayload {
  name: string,
  type: number,
}

export const getCats = async (): Promise<Array<Category>> => {
  const catRepo = getRepository(Category);
  return catRepo.find();
};

export const getCat = async (id: number): Promise<Category | null> => {
  const catRepo = getRepository(Category);
  const category = await catRepo.findOne({id: id});
  if (!category) return null;
  return category;
};

export const createCat = async (payload: iCatPayload): Promise<Category> => {
  const catRepo = getRepository(Category);
  const category = new Category();
  return catRepo.save({
    ...category,
    ...payload
  });
};