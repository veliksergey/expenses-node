import {Get, Route, Tags, Post, Body, Path} from 'tsoa';
import {Person} from '../models';
import {getPersons, getPerson, createPerson, iPersonPayload} from '../repositories/person.repository';

@Route('persons')
@Tags('person')
export default class PersonController {
  @Get('/')
  public async getPersons(): Promise<Array<Person>> {
    return getPersons();
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