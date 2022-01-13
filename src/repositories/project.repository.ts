import {getRepository} from 'typeorm';
// import {Project} from '../models';
import {Project} from '../models';

export interface iProjectPayload {
  projectName: string,
}

export const getProjects = async (): Promise<Array<Project>> => {
  const projectRepository = getRepository(Project);
  return projectRepository.find();
};

export const getProject = async (id: number): Promise<Project | null> => {
  const projectRepository = getRepository(Project);
  const project = await projectRepository.findOne({id: id});
  if (!project) return null;
  return project;
};

export const createProject = async (payload: iProjectPayload): Promise<Project> => {
  const projectRepository = getRepository(Project);
  const project = new Project();
  return projectRepository.save({
    ...project,
    ...payload
  });
};