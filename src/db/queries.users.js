const User = require("./models").User;
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

    upgradeUser(req, callback){
        return User.findById(req.user.id)
        .then((user) => {
            User.update(
                {role : 2}
            )
        })
        .then(() => {
            console.log("successfully upgraded from queries.users.js");
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    }
}