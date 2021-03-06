const Wiki = require("./models").Wiki;
const Collaboration = require("./models").Collaboration;
const User = require("./models").User;
const Authorizer = require("../policies/application");


module.exports = {
    getAllWikis(callback){
        return Wiki.all({
            where: {private: false},
            include: [
                {model: Collaboration, as: "collaborations", include: [
                    {model: User }
                ]}
            ]
        })
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getAllPrivateWikis(callback){
        return Wiki.all({
            where: { private: true}, 
            include: [
                {model: Collaboration, as: "collaborations", include: [
                    {model: User }
                ]}
            ]
        })
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            console.log("private wiki wasn't found");
            console.log(err);
            callback(err);
        })   
    },

    addWiki(newWiki, callback){
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            private: newWiki.private,
            userId: newWiki.userId
        })
        .then((wiki) => {
            console.log("new wiki was created from inside pf queries.wikis");
            callback(null, wiki);
        })
        .catch((err) => {
            console.log("wiki wasn't created from queries.wikis folder");
            callback(err);
        })
    },

    getWiki(id, callback){
        return Wiki.findById(id, {
            include: [
                {model: Collaboration, as: "collaborations", include: [
                    {model: User }
                ]}
            ]
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },

    deleteWiki(req, callback){

        return Wiki.findById(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).destroy();
            if(authorized){
                wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.")
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },

    updateWiki(req, updatedWiki, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(!wiki){
                return callback("Wiki not found");
            }

            wiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
            })
            .then(() => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            });
          
        });
    }
}