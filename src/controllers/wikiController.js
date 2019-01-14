const wikiQueries = require("../db/queries.wikis.js");
const collaborationQueries = require("../db/queries.collaborations.js");
const Authorizer = require("../policies/application");
const markdown = require("markdown").markdown;

module.exports = {
    index(req, res, next){
        wikiQueries.getAllWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/wiki", {wikis});
            }
        })
    },

    indexPrivate(req, res, next){
        
        wikiQueries.getAllPrivateWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                //find if the person is a collabo member or not
                function isCollabo(callback){
                    collaborationQueries.findCollaboMember(req.user.id, (err, res) => {
                        if(res == true){
                            var collaboMember = req.user;
                            //pass in the collaboMember to callback
                            callback(null, collaboMember);
                        } else {
                            var nonCollaboMember = req.user;
                            //pass in the nonCollaboMember to callback
                            callback(nonCollaboMember, null);
                        }
                    });
                }
                
                //evoke isCollabo function 
                isCollabo((nonCollaboMember, collaboMember) => {
                    const authorized = new Authorizer(nonCollaboMember, wikis, collaboMember).showPrivate();
                    if(authorized){
                        res.render("wikis/privateWiki", {wikis});
                     } else {
                        req.flash("notice", "You are not authorized to do that.");
                        res.redirect("/wikis");
                    }
                 });      
            }
        })  
    },

    new(req, res, next){

        const authorized = new Authorizer(req.user).new();
        if(authorized){
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    create(req, res, next){
        const authorized = new Authorizer(req.user).create();
        if(authorized){
            let newWiki = {
                title: markdown.toHTML(req.body.title),
                body: markdown.toHTML(req.body.body),
                private: req.body.private || false,
                userId: req.user.id
            };

            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if(err){
                    res.redirect(500, "/wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/wikis");
            } else {
                res.render("wikis/show", {wiki});
            }
        });
    },

    destroy(req, res, next){
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err){
                res.redirect(err, `/wikis/${req.params.id}`);
            } else {
                res.redirect(303, "/wikis");
            }
        });
    },

    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/wikis");
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();

                if(authorized){
                    res.render("wikis/edit", {wiki});
                } else {
                    req.flash("You are not authorized to do that.")
                    res.redirect(`/wikis/${req.params.id}`)
                }
            }
        });
    },

    update(req, res, next){
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            console.log("wiki is updated while adding new collaborator.");
            if(err || wiki == null){
                res.redirect(401, `/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    }


}