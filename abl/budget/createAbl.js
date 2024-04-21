const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv({ useDefaults: true});
addFormats(ajv);

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const budgetDao = require("../../dao/budget-dao.js");
const userDao = require("../../dao/user-dao.js");
const dashboardDao = require("../../dao/dashboard-dao.js");

const schema = {
    type: "object",
    properties: {
        name: { type: "string", minLength: 3, default: "New Budget" },
        moneyLimit: { type: "integer", minimum: 0 },
        granule: { type: "string", default: "month" },
        remainingBudget: { type: "integer", minimum: 0 },
        userId: { type: "string", minLength: 32, maxLength: 32 },
        dashboardId: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: ["moneyLimit", "userId", "dashboardId"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let budget = req.body;

        // validate input
        const valid = ajv.validate(schema, budget);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const userList = userDao.list();
        const dashboardList = dashboardDao.list();

        if (!userList.some((u) => u.id === budget.userId)) {
            res.status(404).json({
                code: "userNotFound",
                message: `User ${budget.userId} not found`,
            });
            return;
        } 
        else if (!dashboardList.some((d) => d.id === budget.dashboardId)) {
            res.status(404).json({
                code: "dashboardNotFound",
                message: `Dashboard ${budget.dashboardId} not found`,
            });
            return;
        }

        if (!budget.remainingBudget) {
            budget.remainingBudget = budget.moneyLimit;
        }

        budget = budgetDao.create(budget);
        res.json(budget);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = CreateAbl;
