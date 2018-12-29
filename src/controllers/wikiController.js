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
            userId: 1
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
                res.redirect(404, "/");
            } else {
                res.redirect("wikis/show", {wiki})
            }
        });
    }







}