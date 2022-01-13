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
exports.createTransaction = exports.getTransaction = exports.getTransactions = void 0;
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
function prepareOrderByWay(orderBy, orderWay) {
    const allowedOrders = ['id', 'transName'];
    if (!allowedOrders.includes(orderBy))
        orderBy = 'id';
    orderWay = orderWay.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    return { [orderBy]: orderWay };
}
// ToDo: replace "any" with something better
// export const getTransactions = async():Promise<{transactions: Array<Transaction>, transactionCount: number}> => {
const getTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const transRepo = (0, typeorm_1.getRepository)(models_1.Transaction);
    const search = 'sml';
    const order = prepareOrderByWay('transName', 'ASC');
    const page = +'1';
    const take = Number('10'); // limit
    const skip = (page - 1) * take;
    // ToDo: search, pagination, etc
    // return await transRepo.find({relations: ['project']});
    // const [transactions, transactionCount] = await transRepo
    //   .findAndCount({relations: ['related']});
    //
    // return {transactions, transactionCount};
    // const trans = await transRepo
    //   .createQueryBuilder('t')
    //   // .select(['t.id', 't.transName', 't.amount', 't.date', 't.notes'])
    //   .leftJoinAndSelect('t.project', 'project')
    //   .leftJoinAndSelect('t.vendor', 'vendor')
    //   // .leftJoinAndSelect('t.related', 'transaction')
    //   .skip(skip) // pagination
    //   .take(take)
    //   .maxExecutionTime(5000) // limit of execution time to avoid a server crashing
    //   .printSql() // for debugging
    //   .getMany();
    let findOptions = {
        skip, take, order,
    };
    if (search.trim())
        findOptions.where = [
            { transName: (0, typeorm_1.ILike)(`%${search}%`) },
            { project: { projectName: (0, typeorm_1.ILike)(`%${search}%`) } },
            { vendor: { vendorName: (0, typeorm_1.ILike)(`%${search}%`) } },
        ];
    // console.log(findOptions);
    const [result, total] = yield transRepo.findAndCount(Object.assign({ relations: ['project', 'vendor'] }, findOptions));
    return { result, total };
});
exports.getTransactions = getTransactions;
const getTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transRepo = (0, typeorm_1.getRepository)(models_1.Transaction);
    const trans = yield transRepo.findOne({ id });
    console.log('-- trans:', trans);
    if (!trans)
        return null;
    return trans;
});
exports.getTransaction = getTransaction;
const createTransaction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transRepo = (0, typeorm_1.getRepository)(models_1.Transaction);
    const trans = new models_1.Transaction();
    // ToDo: get it from DB
    return transRepo.save(Object.assign(Object.assign({}, trans), payload));
});
exports.createTransaction = createTransaction;
