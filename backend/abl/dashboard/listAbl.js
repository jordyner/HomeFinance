const dashboardDao = require("../../dao/dashboard-dao.js");

async function ListAbl(req, res) {
    try {
        const dashboardList = dashboardDao.list();
        res.json(dashboardList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = ListAbl;
