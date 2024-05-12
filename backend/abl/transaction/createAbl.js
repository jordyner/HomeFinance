const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

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
    "Investments",
    "Charity"
];

const schema = {
    type: "object",
    properties: {
        date: { type: "string", format: "date-time" },
        amount: { type: "integer", minimum: 0 },
        category: { type: "string" },
        note: { type: "string" },
        userId: { type: "string", minLength: 32, maxLength: 32 },

    },
    required: ["date", "amount", "category", "userId"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let transaction = req.body;

        // validate input
        const valid = ajv.validate(schema, transaction);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const userList = userDao.list();
        expenseCategories = expenseCategories.map((c) => c.toLowerCase());
        if (!expenseCategories.includes(transaction.category.toLowerCase())) {
            res.status(400).json({
                code: "categoryIsNotValid",
                message: `Category ${transaction.category} is not valid. Valid categories are: ${expenseCategories.join(", ")}`,
            });
            return;
        }
        else if (!userList.some((u) => u.id === transaction.userId)) {
            res.status(404).json({
                code: "userNotFound",
                message: `User ${transaction.userId} not found`,
            });
            return;
        }

        if (!transaction.note) {
            transaction.note = "";
        }

        transaction = transactionDao.create(transaction);
        res.json(transaction);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = CreateAbl;
