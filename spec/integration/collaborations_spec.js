const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaboration = require("../../src/db/models").Collaboration;

describe("routes: collaboration", () => {
    beforeEach((done) => {
        this.user;
        this.wiki;
        
        sequelize.sync({force: true}).then((res) => {
            User.create({
                name: "Arata Kagan",
                email: "test@gmail.com",
                password: "testtesttest",
                role: 0
            })
            .then((user) => {
                this.user = user;
                Wiki.create({
                    title: "Test wiki",
                    body: "This is test wiki please ignore",
                    

                })
            })
        })
    })
})