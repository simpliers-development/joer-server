import { Transaction } from "sequelize/types";

export type uuid = string;

export type TransactionOptions = { transaction: Transaction };
