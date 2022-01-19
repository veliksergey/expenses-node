import {Get, Route, Tags, Post, Body, Path} from 'tsoa';
import {Category} from '../models';
import {getCats, getCat, createCat, iCatPayload} from '../repositories/category.repository';

@Route('categories')
@Tags('category')
export default class CategoryController {
  @Get('/')
  public async getCats(): Promise<Array<Category>> {
    return getCats();
  }

  @Get('/:id')
  public async getCat(@Path() id: string): Promise<Category | null> {
    return getCat(Number(id));
  }

  @Post('/')
  public async createCat(@Body() body: iCatPayload): Promise<Category> {
    return createCat(body);
  }
}