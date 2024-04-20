const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/transaction/getAbl");
const ListAbl = require("../abl/transaction/listAbl");
const CreateAbl = require("../abl/transaction/createAbl");
const UpdateAbl = require("../abl/transaction/updateAbl");
const DeleteAbl = require("../abl/transaction/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
