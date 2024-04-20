const Ajv = require("ajv");
const ajv = new Ajv();

const userDao = require("../../dao/user-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: ["id"],
    additionalProperties: false,
};

async function DeleteAbl(req, res) {
    try {
        // get request query or body
        const reqParams = req.body;

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

        userDao.remove(reqParams.id);

        const userList = userDao.list();

        userList.map(async (user) => {
            if (user.familyGroup && user.familyGroup.includes(reqParams.id)) {
                user.familyGroup = user.familyGroup.filter(memberId => memberId !== reqParams.id);
                return userDao.update(user); 
            }
        });

        res.json({});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = DeleteAbl;
