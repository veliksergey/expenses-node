import {getRepository} from 'typeorm';
import {Account, Category, Person, Project, Vendor} from '../models';

export interface iItemPayload {
  name: string;
}

const getModel = (type: string) => {
  let model;
  switch (type) {
    case 'account':
      model = Account;
      break;
    case 'category':
      model = Category;
      break;
    case 'person':
      model = Person;
      break;
    case 'project':
      model = Project;
      break;
    case 'vendor':
      model = Vendor;
      break;
  }
  return model;
}

const getItemRepo = (type: string) => {
  const model = getModel(type);
  if (!model) return null;
  return getRepository(model);
}

export const getItems = async(type: string): Promise<({ errMsg: string } | Array<Account | Category | Person | Project | Vendor>)> => {
  const itemRepo = getItemRepo(type);
  if (!itemRepo) return {errMsg: 'wrong item type'};
  return itemRepo.find();
}

export const getItem = async(type: string, id: number): Promise<Account | Category | Person | Project | Vendor | null | {errMsg: string}> => {
  console.log('-- getItem:', type, id);
  const itemRepo = getItemRepo(type);
  if (!itemRepo) return {errMsg: 'wrong item type'};

  const item = await itemRepo.findOne(id);
  return item || null;
}

export const createItem = async (type: string, payload: iItemPayload): Promise<any> => {
  const itemRepo = getItemRepo(type);
  if (!itemRepo) return {errMsg: 'wrong item type'};
  const model = getModel(type);
  if (!model) return {errMsg: 'could not get model'};
  const item = new model();

  const created = itemRepo.create({
    ...item,
    ...payload,
  });

  // return await itemRepo.save(
  //   created
  // ).catch(err => {
  //   console.error(err);
  //   return {errMsg: err.detail};
  // })

  return itemRepo.save(created)
    .then(savedItem => {
      return savedItem;
    })
    .catch(err => {
      console.error(err);
      return {errMsg: `Cannot save ${type}. ${err.detail}`}
    })
}

export const updateItem = async (type: string, id: number, payload: iItemPayload): Promise<any> => {
  const itemRepo = getItemRepo(type);
  if (!itemRepo) return {errMsg: 'wrong item type'};

  const item = await itemRepo.findOne(id);
  if (!item) return {errMsg: `${type} not found`};

  item.name = payload.name;

  return itemRepo.save(item)
    .then(savedItem => {
      console.log('-- savedItem:', savedItem);
      return savedItem;
    })
    .catch(err => {
      console.error(err);
      return {errMsg: `Cannot save ${type}. ${err.detail}`};
    })
}