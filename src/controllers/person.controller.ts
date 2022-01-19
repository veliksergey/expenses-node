import {Get, Route, Tags, Post, Body, Path} from 'tsoa';
import {Person} from '../models';
import {getPeople, getPerson, createPerson, iPersonPayload} from '../repositories/person.repository';

@Route('people')
@Tags('person')
export default class PersonController {
  @Get('/')
  public async getPeople(): Promise<Array<Person>> {
    return getPeople();
  }

  @Get('/:id')
  public async getPerson(@Path() id: string): Promise<Person | null> {
    return getPerson(Number(id));
  }

  @Post('/')
  public async createPerson(@Body() body: iPersonPayload): Promise<Person> {
    return createPerson(body);
  }
}