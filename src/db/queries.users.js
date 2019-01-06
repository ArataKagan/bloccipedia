const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');


module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);
        
        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            console.log("Right after new user was created");
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: user.email,
                from: 'aratakagan@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
              };
            sgMail.send(msg);
            console.log("Message was sent.")
            callback(null, user);
        })
        .catch((err) => {
            console.log("New user wasn't created");
            callback(err);
        })
    },

    upgradeUser(id, callback){
        return User.findById(id)
        .then((user) => {
            if(!user){ 
                return callback("User not found");
            } else {
                console.log(user);
                return user.update({role : 1})
                .then(() => {
                    callback(null, user);
                })
                .catch((err) => {
                    callback(err);
                });
            }});
    },

    downgradeUser(id, callback){
        return User.findById(id)
        .then((user) => {
            if(!user){
                return callback("User not found");
            } else {
                console.log(user);
                return user.update({role : 0})
                .then(() => {
                    console.log("user id: ", id);
                    return Wiki.findAll({
                        where: {userId: id}
                    })
                    .then((wikis) => {
                        console.log("found wiki");
                        console.log(wikis[0].title);
                        return wikis.forEach((wiki) => {
                            wiki.update({private : false})
                        })
                        .then(() => {
                            callback(null, user);
                            callback(null, wikis);
                        })
                        .catch((err) => {
                            callback(err);
                        });
                    });
                })
                .catch((err) => {
                    callback(err);
                });
        }});
    }
}
