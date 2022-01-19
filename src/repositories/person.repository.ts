import {getRepository} from 'typeorm';
import {Person} from '../models';

export interface iPersonPayload {
  name: string,
}

export const getPersons = async (): Promise<Array<Person>> => {
  const personRepo = getRepository(Person);
  return personRepo.find();
};

export const getPerson = async (id: number): Promise<Person | null> => {
  const personRepo = getRepository(Person);
  const person = await personRepo.findOne({id: id});
  if (!person) return null;
  return person;
};

export const createPerson = async (payload: iPersonPayload): Promise<Person> => {
  const personRepo = getRepository(Person);
  const person = new Person();
  return personRepo.save({
    ...person,
    ...payload
  });
};