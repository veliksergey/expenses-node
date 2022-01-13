"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_router_1 = __importDefault(require("./project.router"));
const vendor_route_1 = __importDefault(require("./vendor.route"));
const transaction_router_1 = __importDefault(require("./transaction.router"));
const router = express_1.default.Router();
router.use('/projects', project_router_1.default);
router.use('/vendors', vendor_route_1.default);
router.use('/transactions', transaction_router_1.default);
exports.default = router;
