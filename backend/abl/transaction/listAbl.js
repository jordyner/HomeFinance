const transactionDao = require("../../dao/transaction-dao.js");

async function ListAbl(req, res) {
    try {
        const transactionList = transactionDao.list();
        res.json(transactionList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = ListAbl;
