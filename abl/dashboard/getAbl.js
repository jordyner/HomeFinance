const Ajv = require("ajv");
const ajv = new Ajv();

const dashboardDao = require("../../dao/dashboard-dao.js");

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

        // read dashboard by given id
        const dashboard = dashboardDao.get(reqParams.id);
        if (!dashboard) {
            res.status(404).json({
                code: "dashboardNotFound",
                message: `Dashboard ${reqParams.id} not found`,
            });
            return;
        }

        res.json(dashboard);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = GetAbl;
