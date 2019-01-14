const Collaboration = require("./models").Collaboration;
const Wiki = require("./models").Wiki;
const User = require("./models").User;
module.exports = {

addMember(wikiId, email, callback){
    console.log("went inside of the query file.");
    
    return User.findOne({
        where: {email: email}
    })
    .then((user) => {
        console.log("User was found inside of query file");
        console.log(user.id); 
        console.log(wikiId);
        Collaboration.create({
            wikiId: wikiId,
            userId: user.id
        })
        .then((collaboration) => {
            console.log("collaboration created");
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

deleteMember(memberId, callback){
    console.log("went inside of queries.collaboration");
    console.log(memberId);
    return Collaboration.findOne({
        where: { userId: memberId }
    })
    .then((collaborator) => {
        console.log("deleting collaborator is found and going to delete now.")
        console.log(collaborator);
        collaborator.destroy();
        callback(null, collaborator);
        console.log("record deleted");
    })
    .catch((err) => {
        console.log("something went wrong");
        callback(err);
    }); 
},

findCollaboMember(memberId, callback){
    return Collaboration.findOne({
        where: { userId: memberId }
    })
    .then((collaborator) => {
        if(collaborator == null){
            console.log("this member is not a collabo member");
            callback(null, false);
        } else {
            console.log("this member is a collabo member");
            callback(null, true);
        }
    })
    .catch((err) => {
        console.log("couldn't find the collabo member");
        callback(err);
    })
}

}