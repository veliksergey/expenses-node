import {Get, Route, Tags, Post, Body, Path} from 'tsoa';
// import {Vendor} from '../models';
import {Vendor} from '../models/vendor';
import {getVendors, getVendor, createVendor, iVendorPayload} from '../repositories/vendor.repository';

@Route('vendors')
@Tags('vendor')
export default class VendorController {

  @Get('/')
  public async getVendors(): Promise<Array<Vendor>> {
    return getVendors();
  }

  @Get('/:id')
  public async getVendor(@Path() id: string):Promise<Vendor | null> {
    return getVendor(Number(id));
  }

  @Post('/')
  public async createVendor(@Body() body: iVendorPayload): Promise<Vendor> {
    return createVendor(body);
  }
}