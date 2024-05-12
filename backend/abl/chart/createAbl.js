const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const chartDao = require("../../dao/chart-dao.js");

// I want to start with just 3 chart types at the beginning
const chartNames = [
    "Bar",
    "Pie",
    "Line"
  ];
  

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string" },
    },
    required: ["name", "description"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
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

        const lowerCaseChartNames = chartNames.map(name => name.toLowerCase());
        if (!lowerCaseChartNames.includes(chart.name.toLowerCase())) {
            res.status(400).json({
                code: "chartIsNotValid",
                message: `Chart name ${chart.name} is not valid. Valid charts are: ${chartNames.join(", ")}`,
            });
            return;
        }

        chart = chartDao.create(chart);
        res.json(chart);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = CreateAbl;
