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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ctrl = new transaction_controller_1.default();
    const transactions = yield ctrl.getTransactions();
    return res.json(transactions);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ctrl = new transaction_controller_1.default();
    const response = yield ctrl.getTransaction(req.params.id);
    if (!response)
        return res.status(404).json({ message: 'No transaction found' });
    return res.json(response);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ctrl = new transaction_controller_1.default();
    const response = yield ctrl.createTransaction(req.body);
    return res.json(response);
}));
exports.default = router;
