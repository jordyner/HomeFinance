const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv({ useDefaults: true });
addFormats(ajv);

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const dashboardDao = require("../../dao/dashboard-dao.js");
const chartDao = require("../../dao/chart-dao.js");

let expenseCategories = [
    "Food",
    "Clothing",
    "Transport",
    "Housing",
    "Healthcare",
    "Education",
    "Communications",
    "Entertainment",
    "Investments",
    "Charity"
];

const schema = {
    type: "object",
    properties: {
        lastChange: { type: "string", format: "date-time", default: new Date().toLocaleString() },
        chartId: { type: "string" },
        category: { type: "string" }
    },
    required: ["chartId", "category"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let dashboard = req.body;
        // validate input
        const valid = ajv.validate(schema, dashboard);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const chartList = chartDao.list();

        expenseCategories = expenseCategories.map((c) => c.toLowerCase());
        if (!expenseCategories.includes(dashboard.category.toLowerCase())) {
            res.status(400).json({
                code: "categoryIsNotValid",
                message: `Category ${transaction.category} is not valid. Valid categories are: ${expenseCategories.join(", ")}`,
            });
            return;
        }
        else if (!chartList.some((u) => u.id === dashboard.chartId)) {
            res.status(404).json({
                code: "chartNotFound",
                message: `Chart ${dashboard.chartId} not found`,
            });
            return;
        }

        dashboard = dashboardDao.create(dashboard);
        res.json(dashboard);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = CreateAbl;
