"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getProject = exports.getProjects = void 0;
const typeorm_1 = require("typeorm");
// import {Project} from '../models';
const models_1 = require("../models");
const getProjects = () => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(models_1.Project);
    return projectRepository.find();
});
exports.getProjects = getProjects;
const getProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(models_1.Project);
    const project = yield projectRepository.findOne({ id: id });
    if (!project)
        return null;
    return project;
});
exports.getProject = getProject;
const createProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(models_1.Project);
    const project = new models_1.Project();
    return projectRepository.save(Object.assign(Object.assign({}, project), payload));
});
exports.createProject = createProject;
