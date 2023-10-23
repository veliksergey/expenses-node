import {Get, Route, Tags, Post, Body, Path, Query} from 'tsoa';
import {Document} from '../models';
import {getDocuments, createDocument, uploadDocument, iDocPayload} from '../repositories/document.repository';

@Route('documents')
@Tags('document')
export default class DocumentController {

  @Get('/')
  public async getDocuments(
    @Query() transactionId: any
  ): Promise<Array<Document>> {
    return getDocuments(Number(transactionId));
  }

  @Post('/')
  public async createDocument(@Body() body: Document) : Promise<Document> {
    return createDocument(body);
  }

  // ToDo: remove, unused function
  @Post('/upload')
  public async uploadDocument(@Body() body: Document): Promise<Document> {
    return uploadDocument(body);
  }

}