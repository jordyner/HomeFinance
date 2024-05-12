const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const transactionDao = require("../../dao/transaction-dao.js");
const userDao = require("../../dao/user-dao.js");

let expenseCategories = [
    "Food",
    "Clothing",
    "Transport",
    "Housing",
    "Healthcare",
    "Education",
    "Communications",
    "Entertainment",
    "Savings/Investments",
    "Gifts/Charity"
];

const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 },
        date: { type: "string", format: "date-time" },
        amount: { type: "integer", minimum: 0 },
        category: { type: "string" },
        note: { type: "string" },
        userId: { type: "string", minLength: 32, maxLength: 32 },

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
        const transactionList = transactionDao.list();
        expenseCategories = expenseCategories.map((c) => c.toLowerCase());
        if (props.category && !expenseCategories.includes(props.category)) {
            res.status(400).json({
                code: "categoryIsNotValid",
                message: `Category ${props.category} is not valid. Valid categories are: ${expenseCategories.join(", ")}`,
            });
            return;
        }
        else if (!userList.some((u) => u.userId === props.userId)) {
            res.status(404).json({
                code: "userNotFound",
                message: `User ${props.userId} not found`,
            });
            return;
        }

        const updatedTransaction = transactionDao.update(props);
        if (!updatedTransaction) {
            res.status(404).json({
                code: "transactionNotFound",
                message: `Transaction ${transaction.id} not found`,
            });
            return;
        }

        res.json(updatedTransaction);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = UpdateAbl;
