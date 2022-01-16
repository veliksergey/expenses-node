import {Get, Route, Tags, Post, Body, Path} from 'tsoa';
import {Account} from '../models';
import {getAccounts, getAccount, createAccount, AccountPayload} from '../repositories/account.repository';

@Route('accounts')
@Tags('account')
export default class AccountController {

  @Get('/')
  public async getAccounts(): Promise<Array<Account>> {
    return getAccounts();
  }

  @Get('/:id')
  public async getAccount(@Path() id: string): Promise<Account | null> {
    return getAccount(Number(id));
  }

  @Post('/')
  public async createAccount(@Body() body: AccountPayload):Promise<Account> {
    return createAccount(body);
  }

}