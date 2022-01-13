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
exports.getVendor = exports.createVendor = exports.getVendors = void 0;
const typeorm_1 = require("typeorm");
// import {Vendor} from '../models';
const models_1 = require("../models");
const getVendors = () => __awaiter(void 0, void 0, void 0, function* () {
    const vendorRepo = (0, typeorm_1.getRepository)(models_1.Vendor);
    return vendorRepo.find();
});
exports.getVendors = getVendors;
const createVendor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorRepo = (0, typeorm_1.getRepository)(models_1.Vendor);
    const vendor = new models_1.Vendor();
    return vendorRepo.save(Object.assign(Object.assign({}, vendor), payload));
});
exports.createVendor = createVendor;
const getVendor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorRepo = (0, typeorm_1.getRepository)(models_1.Vendor);
    const vendor = yield vendorRepo.findOne({ id: id });
    if (!vendor)
        return null;
    return vendor;
});
exports.getVendor = getVendor;
