const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const budgetDao = require("../../dao/budget-dao.js");
const userDao = require("../../dao/user-dao.js");
const dashboardDao = require("../../dao/dashboard-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 },
        date: { type: "string", format: "date-time" },
        moneyLimit: { type: "integer", minimum: 0 },
        note: { type: "string" },
        userId: { type: "string", minLength: 32, maxLength: 32 },
        dashboardId: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: ["id"],
    additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        let props = req.body;

        // validate input
        const valid = ajv.validate(schema, props);
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

        if (props.userId && !userList.some((u) => u.id === props.userId)) {
            res.status(404).json({
                code: "userNotFound",
                message: `User ${props.userId} not found`,
            });
            return;
        } else if (props.dashboardId && !dashboardList.some((d) => d.id === props.dashboardId)) {
            res.status(404).json({
                code: "dashboardNotFound",
                message: `Dashboard ${props.dashboardId} not found`,
            });
            return;
        }

        const updatedBudget = budgetDao.update(props);
        if (!updatedBudget) {
            res.status(404).json({
                code: "budgetNotFound",
                message: `Budget ${props.id} not found`,
            });
            return;
        }

        res.json(updatedBudget);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = UpdateAbl;
