const chartDao = require("../../dao/chart-dao.js");

async function ListAbl(req, res) {
    try {
        const chartList = chartDao.list();
        res.json(chartList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = ListAbl;
