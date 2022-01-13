"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Transaction_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("./index");
let Transaction = Transaction_1 = class Transaction {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        nullable: false,
        update: true,
        insert: true,
        select: true,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "transName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        default: () => 'CURRENT_DATE'
    }),
    __metadata("design:type", Date)
], Transaction.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], Transaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Transaction.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => index_1.Project, (project) => project.transactions, {
        eager: true,
        nullable: false,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", index_1.Project)
], Transaction.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Transaction.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => index_1.Vendor, (vendor) => vendor.transactions, {
        eager: true,
        nullable: false,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", index_1.Vendor)
], Transaction.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => Transaction_1),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Transaction.prototype, "related", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ select: false }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ select: false }),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ select: false }),
    __metadata("design:type", Date)
], Transaction.prototype, "deletedAt", void 0);
Transaction = Transaction_1 = __decorate([
    (0, typeorm_1.Entity)()
], Transaction);
exports.Transaction = Transaction;
