import TransactionSchema from "./TransactionSchema.js"

export const postTransaction = (obj) => {
  return TransactionSchema(obj).save()}