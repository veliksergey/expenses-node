import {Get, Post, Put, Route, Tags, Body, Path, Delete} from 'tsoa';
import {Account, Category, Person, Project, Vendor} from '../models';
import {
  createItem,
  getItem,
  getItems,
  iItemPayload,
  updateItem,
  deleteItem,
  getAllItems
} from '../repositories/item.repository';

@Route('items')
@Tags('item')
export default class ItemController {

  @Get('/all')
  public async getAllItems():Promise<any> {
    return getAllItems();
  }

  @Get('/{type}')
  public async getItems(
    @Path() type: string
  ): Promise<({ errMsg: string } | Array<Account | Category | Person | Project | Vendor>)> {
    return getItems(type);
  }

  @Get('/{type}/{id}')
  public async getItem(
    @Path() type: string,
    @Path() id: string
  ): Promise<any> {
    return getItem(type, Number(id));
  }

  @Post('/{type}')
  public async createItem(
    @Path() type: string,
    @Body() body: iItemPayload,
  ): Promise<any> {
    return createItem(type, body)
  }

  @Put('/{type}/{id}')
  public async updateItem(
    @Path() type: string,
    @Path() id: string,
    @Body() body: iItemPayload
  ): Promise<any> {
    return updateItem(type, Number(id), body);
  }

  @Delete('/{type}/{id}')
  public async deleteItem(
    @Path() type: string,
    @Path() id: string,
  ): Promise<{errMsg: string} | {deleted: boolean}> {
    return deleteItem(type, Number(id));
  }
}