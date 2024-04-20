const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const transactionFolderPath = path.join(__dirname, "storage", "transactionList");

// Method to read an transaction from a file
function get(transactionId) {
  try {
    const filePath = path.join(transactionFolderPath, `${transactionId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadTransaction", message: error.message };
  }
}

// Method to write an transaction to a file
function create(transaction) {
  try {
    transaction.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(transactionFolderPath, `${transaction.id}.json`);
    const fileData = JSON.stringify(transaction);
    fs.writeFileSync(filePath, fileData, "utf8");
    return transaction;
  } catch (error) {
    throw { code: "failedToCreateTransaction", message: error.message };
  }
}

// Method to update transaction in a file
function update(transaction) {
  try {
    const currentTransaction = get(transaction.id);
    if (!currentTransaction) return null;
    const newTransaction = { ...currentTransaction, ...transaction };
    const filePath = path.join(transactionFolderPath, `${transaction.id}.json`);
    const fileData = JSON.stringify(newTransaction);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newTransaction;
  } catch (error) {
    throw { code: "failedToUpdateTransaction", message: error.message };
  }
}

// Method to remove an transaction from a file
function remove(transactionId) {
  try {
    const filePath = path.join(transactionFolderPath, `${transactionId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveTransaction", message: error.message };
  }
}

// Method to list transactions in a folder
function list() {
  try {
    const files = fs.readdirSync(transactionFolderPath);
    const transactionList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(transactionFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return transactionList;
  } catch (error) {
    throw { code: "failedToListTransactions", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
