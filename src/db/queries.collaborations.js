const Collaboration = require("./models").Collaboration;
const Wiki = require("./models").Wiki;
const User = require("./models").User;
module.exports = {

addMember(req, newUserEmail, callback){
    return User.findOne({
        where: {email: newUserEmail}
    })
    .then((user) => {
        Collaboration.create({
            wikiId: req.params.id,
            userId: user.id
        })
        .then((collaboration) => {
            callback(null, collaboration);
        })
        .catch((err) => {
            callback(err);
        });
    })
    .catch((err) => {
        callback(err);
    });
},

deleteMember(req, )




}