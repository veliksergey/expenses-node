import {Get, Post, Route, Tags, Body, Path} from 'tsoa';
import {Transaction} from '../models/transaction';
import {getTransactions, getTransaction, createTransaction, iTransPayload} from '../repositories/transaction.repository';

@Route('transactions')
@Tags('transaction')
export default class TransactionController {
  @Get('/')
  public async getTransactions(): Promise<{transactions: Array<Transaction>, transactionCount: number}> {
    return getTransactions();
  }

  @Get('/:id')
  public async getTransaction(@Path() id: string):Promise<Transaction | null> {
    return getTransaction(Number(id));
  }

  @Post('/')
  public async createTransaction(@Body() body: iTransPayload):Promise<Transaction> {
    return createTransaction(body);
  }
}