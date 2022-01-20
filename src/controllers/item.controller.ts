import {Get, Post, Put, Route, Tags, Body, Path} from 'tsoa';
import {Account, Category, Person, Project, Vendor} from '../models';
import {createItem, getItem, getItems, iItemPayload, updateItem} from '../repositories/item.repository';

@Route('items')
@Tags('item')
export default class ItemController {

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

}