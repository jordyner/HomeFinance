const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/user/getAbl");
const ListAbl = require("../abl/user/listAbl");
const CreateAbl = require("../abl/user/createAbl");
const UpdateAbl = require("../abl/user/updateAbl");
const DeleteAbl = require("../abl/user/deleteAbl");
const AddMemberAbl = require("../abl/user/addMemberAbl");
const DeleteMemberAbl = require("../abl/user/deleteMemberAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);
router.post("/addMember", AddMemberAbl);
router.post("/deleteMember", DeleteMemberAbl);

module.exports = router;
