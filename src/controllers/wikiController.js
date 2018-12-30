const wikiQueries = require("../db/queries.wikis.js");

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

    new(req, res, next){
        res.render("wikis/new");
    },

    create(req, res, next){
        console.log("before newWiki is created inside of wikiController")
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: false,
            // userId: 1
        };

        wikiQueries.addWiki(newWiki, (err, wiki) => {
            if(err){
                console.log("error from the wikiController")
                res.redirect(500, "/wikis/new");
            } else {
                res.redirect(303, `/wikis/${wiki.id}`);
            }
        });
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
        wikiQueries.deleteWiki(req.params.id, (err, deletedRecordsCount) => {
            if(err){
                res.redirect(500, `/wikis/${req.params.id}`);
            } else {
                res.redirect(303, `/wikis`);
            }
        });
    },

    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/wikis");
            } else {
                res.render("wikis/edit", {wiki});
            }
        });
    },

    update(req, res, next){
        wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, `/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${wiki.id}`);
            }
        });
    }


}