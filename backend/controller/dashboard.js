const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/dashboard/getAbl");
const ListAbl = require("../abl/dashboard/listAbl");
const CreateAbl = require("../abl/dashboard/createAbl");
const UpdateAbl = require("../abl/dashboard/updateAbl");
const DeleteAbl = require("../abl/dashboard/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
