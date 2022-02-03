import {Get, Post, Put, Route, Tags, Body, Path, Query} from 'tsoa';
import {Transaction} from '../models';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  iTransPayload,
  updateTransaction,
  getPossibleDuplicates,
} from '../repositories/transaction.repository';

@Route('transactions')
@Tags('transaction')
export default class TransactionController {

  @Get('/')
  public async getTransactions(
    @Query() page: string,
    @Query() rowsPerPage: string,
    @Query() sortBy: string,
    @Query() descending: string,
    @Query() search: string,
  ): Promise<{transactions: Array<Transaction>, transactionCount: number}> {

    const params = {
      page: +page || 1,
      rowsPerPage: +rowsPerPage > -1 ? +rowsPerPage : 10,
      sortBy: sortBy.trim() || 'date',
      descending: !(descending === 'false'),
      search: search.trim() || '',
    };

    return getTransactions(params);
  }

  @Get('/duplicates')
  public async getPossibleDuplicates(
    @Query() date: string,
    @Query() amount: string,
    @Query() id: string
  ): Promise<{result: Array<Transaction>, total: number}> {
    return getPossibleDuplicates({date, amount, id});
  }

  @Get('/{id}')
  public async getTransaction(@Path() id: string):Promise<Transaction | null> {
    return getTransaction(Number(id));
  }

  @Post('/')
  public async createTransaction(@Body() body: iTransPayload):Promise<Transaction | {errMsg: string} | null> {
    return createTransaction(body);
  }

  @Put('/{id}')
  public async updateTransaction(@Path() id: string, @Body() body: iTransPayload): Promise<Transaction | null | {errMsg: string}> {
    return updateTransaction(Number(id), body);
  }

}