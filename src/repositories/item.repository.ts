import {getRepository} from 'typeorm';
import {Account, Category, Person, Project, Vendor} from '../models';

export interface iItemPayload {
  name: string;
}

const getModel = (type: string) => {
  let model;
  switch (type) {
    case 'accounts':
      model = Account;
      break;
    case 'categories':
      model = Category;
      break;
    case 'people':
      model = Person;
      break;
    case 'projects':
      model = Project;
      break;
    case 'vendors':
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

export const getAllItems = async(): Promise<any> => {
  const types = ['accounts', 'categories', 'people', 'projects', 'vendors'];
  const arrayOfPromises: any = [];

  types.forEach(type => {
    const itemRepo = getItemRepo(type);
    if (!itemRepo) return {errMsg: 'wrong item type'};
    arrayOfPromises.push(itemRepo.find({order: {name: 'ASC'}}));
  });

  return Promise.all(arrayOfPromises).then(values => {
    const obj: any = {};

    types.forEach((type, idx) => {
      obj[type] = values[idx];
    });

    return obj;
  });
}

export const getItems = async(type: string): Promise<({ errMsg: string } | Array<Account | Category | Person | Project | Vendor>)> => {
  const itemRepo = getItemRepo(type);
  if (!itemRepo) return {errMsg: 'wrong item type'};
  return itemRepo.find({order: {id: 'DESC'}});
}

export const getItem = async(type: string, id: number): Promise<Account | Category | Person | Project | Vendor | null | {errMsg: string}> => {
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
  item.name = payload.name;

  // const created = itemRepo.create(item);

  return itemRepo.save(item)
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
      return {errMsg: `Cannot save ${type}. ${err.detail}`}
    })
}

export const deleteItem = async (type: string, id: number): Promise<{errMsg: string} | {deleted: boolean}> => {
  const itemRepo = getItemRepo(type);
  if (!itemRepo) return {errMsg: 'wrong item type'};

  const item = await itemRepo.findOne(id);
  if (!item) return {errMsg: 'Cannot find an item for deletion'}

  return itemRepo.delete(item)
    .then(deleted => {
      return {deleted: true};
    })
    .catch(err => {
      console.error(err);
      return {errMsg: `Cannot delete item. ${err.detail}`}
    })
}