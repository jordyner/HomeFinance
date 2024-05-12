const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/chart/getAbl");
const ListAbl = require("../abl/chart/listAbl");
const CreateAbl = require("../abl/chart/createAbl");
const UpdateAbl = require("../abl/chart/updateAbl");
const DeleteAbl = require("../abl/chart/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
