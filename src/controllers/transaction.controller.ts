import {Get, Post, Put, Route, Tags, Body, Path, Query} from 'tsoa';
import {Transaction} from '../models';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  iTransPayload,
  updateTransaction
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
    @Query() filter: string,
  ): Promise<{transactions: Array<Transaction>, transactionCount: number}> {

    const params = {
      page: +page || 1,
      rowsPerPage: +rowsPerPage || 10,
      sortBy: sortBy.trim() || 'date',
      descending: !(descending === 'false'),
      filter: filter.trim() || '',
    };

    return getTransactions(params);
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