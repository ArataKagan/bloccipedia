const Wiki = require("./models").Wiki;

module.exports = {
    getAllWikis(callback){
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },

    addWiki(newWiki, callback){
        return Wiki.create(newWiki)
        .then((wiki) => {
            console.log("new wiki was created from inside pf queries.wikis");
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    }
}