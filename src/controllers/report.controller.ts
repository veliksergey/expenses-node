import {Get, Post, Put, Route, Tags, Body, Path, Query} from 'tsoa';
import {Transaction} from '../models';
import {getReport} from '../repositories/report.repository';

@Route('report')
@Tags('report')
export default class ReportController {

  @Get('/')
  public async getReport(
    @Query() accountId: string,
    @Query() categoryId: string,
    @Query() personId: string,
    @Query() projectId: string,
    @Query() vendorId: string,
    @Query() groupBy: string,
  ): Promise<Array<Transaction>> {

    const params = {
      accountId: +accountId,
      categoryId: +categoryId,
      personId: +personId,
      projectId: +projectId,
      vendorId: +vendorId,
      groupBy,
    };

    return getReport(params);
  }

}