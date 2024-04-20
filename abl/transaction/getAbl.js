const Ajv = require("ajv");
const ajv = new Ajv();

const transactionDao = require("../../dao/transaction-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: ["id"],
    additionalProperties: false,
};

async function GetAbl(req, res) {
    try {
        // get request query or body
        const reqParams = req.query?.id ? req.query : req.body;

        // validate input
        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // read transaction by given id
        const transaction = transactionDao.get(reqParams.id);
        if (!transaction) {
            res.status(404).json({
                code: "transactionNotFound",
                message: `Transaction ${reqParams.id} not found`,
            });
            return;
        }

        res.json(transaction);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = GetAbl;
