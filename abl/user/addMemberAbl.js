const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const userDao = require("../../dao/user-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 },
        memberId: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: ["id", "memberId"],
    additionalProperties: false,
};

async function AddMemberAbl(req, res) {
    try {
        let {id, memberId} = req.body;

        // validate input
        const valid = ajv.validate(schema, {id, memberId});
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const user = userDao.get(id);
        if (!user) {
            res.status(404).json({
                code: "userNotFound",
                message: `User ${id} not found`,
            });
            return;
        }

        if (user.familyGroup && user.familyGroup.includes(memberId)) {
            res.status(400).json({
                code: "memberAlreadyInFamilyGroup",
                message: `Member ${user.memberId} is already in the family group`,
            });
            return;
        }

        user.familyGroup.push(memberId);
        const updatedUser = userDao.update(user);

        res.json(updatedUser);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = AddMemberAbl;
