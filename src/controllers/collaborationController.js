const collaborationQueries = require("../db/queries.collaborations.js");

module.exports = {
    addCollaborator(req, res, next){
        let newCollaborator = {
            email: req.body.email,
            wikiId: req.params.wikiId
        };

        console.log("new collaborator's email, ", newCollaborator.email);
        console.log("wikiId, ", newCollaborator.wikiId);
        collaborationQueries.addMember(newCollaborator.wikiId, newCollaborator.email, (err, member) => {
            if(err){
                req.flash("error", err);
            }
            res.redirect(req.headers.referer);
        });
        
    },

    deleteCollaborator(req, res, next){
        console.log("went inside of collaborationController");
        let deletingUserId = req.params.collaborationUserId;
        console.log("This is deletingUserId: ", deletingUserId);
        
        collaborationQueries.deleteMember(deletingUserId, (err, member) => {
            if(err){
                res.redirect(err, req.headers.referer);
            } else {
                res.redirect(req.headers.referer);
            }
        });
    }
}