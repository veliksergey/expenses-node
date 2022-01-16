import {Get, Route, Tags, Post, Body, Path} from 'tsoa';
import {Cat} from '../models';
import {getCats, getCat, createCat, iCatPayload} from '../repositories/cat.repository';

@Route('cats')
@Tags('cat')
export default class CatController {
  @Get('/')
  public async getCats(): Promise<Array<Cat>> {
    return getCats();
  }

  @Get('/:id')
  public async getCat(@Path() id: string): Promise<Cat | null> {
    return getCat(Number(id));
  }

  @Post('/')
  public async createCat(@Body() body: iCatPayload): Promise<Cat> {
    return createCat(body);
  }
}