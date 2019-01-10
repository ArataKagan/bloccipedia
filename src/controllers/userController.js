const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const stripe = require("stripe")("sk_test_LDUkMyvnlBlHJYwbaL12ZwYB");

module.exports = {
    signUp(req, res, next){
        res.render("users/signup");
    },

    create(req, res, next){
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password_conf: req.body.password_conf
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect(`/`); 
                })  
            }
        });
    },

    signInForm(req, res, next){
        res.render("users/sign_in");
    },

    signIn(req, res, next){
        passport.authenticate("local")(req, res, function(){
            if(!req.user){
                req.flash("notice", "Sign in failed. Please try again.");
                res.redirect("/users/sign_in");
            } else {
                console.log(res.user);
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        })
    },

    signOut(req, res, next){
        req.logout();
        req.flash("notice","You've successfully signed out!");
        res.redirect("/");
    },

    upgradeForm(req, res, next){
        res.render("users/upgrade");
    },

    upgrade(req, res, next){
        const token = req.body.stripeToken;
        const charge = stripe.charges.create({
            amount: 15.00,
            currency: 'usd',
            description: 'premium account fee',
            source: token,
          });
        userQueries.upgradeUser(req.params.id, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect(`/users/${req.params.id}/upgrade`);
            } else {
                console.log("successfully upgraded");
                req.flash("notice", "You've successfully upgraded to premium account!");
                res.redirect("/");
            }
        });
    },

    downgradeForm(req, res, next){
        res.render("users/downgrade");
    },

    downgrade(req, res, next){
        userQueries.downgradeUser(req.params.id, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect(`/users/${req.params.id}/upgrade`);
            } else {
                req.flash("notice", "You've successfully downgraded to standard account");
                res.redirect("/");
            }
        });
    }


}