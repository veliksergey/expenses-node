import {Get, Route, Tags, Post, Body, Path} from 'tsoa';
import {Project} from '../models';
import {getProjects, getProject, createProject, iProjectPayload} from '../repositories/project.repository';

@Route('projects')
@Tags('project')
export default class ProjectController {
  @Get('/')
  public async getProjects(): Promise<Array<Project>> {
    return getProjects();
  }

  @Get('/:id')
  public async getProject(@Path() id: string): Promise<Project | null> {
    return getProject(Number(id));
  }

  @Post('/')
  public async createProject(@Body() body: iProjectPayload): Promise<Project> {
    return createProject(body);
  }
}