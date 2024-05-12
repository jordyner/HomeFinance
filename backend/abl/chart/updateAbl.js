const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const chartDao = require("../../dao/chart-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 },
        description: { type: "string" },

    },
    required: ["id"],
    additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        let chart = req.body;

        // validate input
        const valid = ajv.validate(schema, chart);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const updatedChart = chartDao.update(chart);
        if (!updatedChart) {
            res.status(404).json({
                code: "chartNotFound",
                message: `Chart ${chart.id} not found`,
            });
            return;
        }

        res.json(updatedChart);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = UpdateAbl;
