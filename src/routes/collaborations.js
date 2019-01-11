const express = require("express");
const router = express.Router();

const collaborationController = require("../controllers/collaborationController");

router.post("/wikis/:wikiId/collaborations/add", 
    collaborationController.addCollaborator);

router.post("/wikis/:wikiId/collaborations/:collaborationUserId/destroy",
    collaborationController.deleteCollaborator);

module.exports = router;