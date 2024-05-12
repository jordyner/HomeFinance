const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/budget/getAbl");
const ListAbl = require("../abl/budget/listAbl");
const CreateAbl = require("../abl/budget/createAbl");
const UpdateAbl = require("../abl/budget/updateAbl");
const DeleteAbl = require("../abl/budget/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
