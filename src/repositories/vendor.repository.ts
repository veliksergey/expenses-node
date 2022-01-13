import {getRepository} from 'typeorm';
// import {Vendor} from '../models';
import {Vendor} from '../models';

export interface iVendorPayload {
  vendorName: string,
}

export const getVendors = async():Promise<Array<Vendor>> => {
  const vendorRepo = getRepository(Vendor);
  return vendorRepo.find();
}

export const createVendor = async (payload: iVendorPayload): Promise<Vendor> => {
  const vendorRepo = getRepository(Vendor);
  const vendor = new Vendor();
  return vendorRepo.save({
    ...vendor,
    ...payload
  });
};

export const getVendor = async (id: number): Promise<Vendor | null> => {
  const vendorRepo = getRepository(Vendor);
  const vendor = await vendorRepo.findOne({id: id});
  if (!vendor) return null;
  return vendor;
};