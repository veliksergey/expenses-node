import {getRepository} from 'typeorm';
import {Vendor} from '../models';

export interface iVendorPayload {
  name: string,
}

export const getVendors = async():Promise<Array<Vendor>> => {
  const vendorRepo = getRepository(Vendor);
  return vendorRepo.find();
}

export const getVendor = async (id: number): Promise<Vendor | null> => {
  const vendorRepo = getRepository(Vendor);
  const vendor = await vendorRepo.findOne({id: id});
  if (!vendor) return null;
  return vendor;
};

export const createVendor = async (payload: iVendorPayload): Promise<Vendor | { errMsg: string }> => {
  const vendorRepo = getRepository(Vendor);
  const vendor = new Vendor();
  return vendorRepo.save({
    ...vendor,
    ...payload
  }).catch(err => {
    console.error(err);
    return {errMsg: err.detail};
  })
};