const collaborationQueries = require("../db/queries.collaborations.js");

module.exports = {
    addCollaborator(req, res, next){

        let newCollaborator = {
            email: req.body.email
        };

        if(req.user.role == 1){
            collaborationQueries.addMember(req, newCollaborator, (err, member) => {
                if(err){
                    req.flash("error", err);
                }
                res.redirect(req.headers.referer);
            });
        } else {
            req.flash("notice", "You must be a premium user to do that.")
            req.redirect(`/users/${req.user.id}/upgrade`);
        }
    },

    deleteCollaborator(req, res, next){
        collaborationQueries.deleteMember(req, (err, member) => {
            if(err){
                res.redirect(err, req.headers.referer);
            } else {
                res.redirect(req.headers.referer);
            }
        });
    }
}