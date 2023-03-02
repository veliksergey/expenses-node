import {Get, Post, Put, Route, Tags, Body, Path, Query} from 'tsoa';
import {Transaction} from '../models';
import {getReport} from '../repositories/report.repository';

@Route('report')
@Tags('report')
export default class ReportController {

  @Get('/')
  public async getReport(
    @Query() projectId: string,
    @Query() categoryId: string,
    @Query() year: string,
    @Query() groupBy: string,
    @Query() condition1Id: 'false' | 'true' | 'all',
    @Query() excludeLoans: string,
  ): Promise<Array<Transaction>> {

    console.log('## ctrl projectId:', projectId);
    console.log('## ctrl excludeLoans:', excludeLoans);

    const params = {
      projectId: +projectId,
      categoryId: +categoryId,
      year,
      groupBy,
      condition1Id,
      excludeLoans,
    };

    return getReport(params);
  }

}