const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaboration = require("../../src/db/models").Collaboration;

describe("Collaboration", () => {
    beforeEach((done) => {
        this.wiki;
        this.user;
        this.collaboration;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                name: "Test test",
                email: "test@gmail.com",
                password: "testtesttest",
                role: 1
            })
            .then((res) => {
                this.user = res;

                Wiki.create({
                    title: "Test wiki for collabo",
                    body: "This is test please ignore",
                    private: true,
                    userId: this.user.id 
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })
    });

    describe("#create", () => {
        it("should add a collaboration member to the wiki", (done) => {
            Collaboration.create({
                wikiId: this.wiki.id,
                userId: this.user.id
            })
            .then((collaboration) => {
                expect(collaboration.wikiId).toBe(this.wiki.id);
                expect(collaboration.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#setUser", () => {
        it("should associate a wiki and user together", (done) => {
            Collaboration.create({
                wikiId: this.wiki.id,
                userId: this.user.id
            })
            .then((collaboration) => {
                this.collaboration = collaboration;
                expect(collaboration.userId).toBe(this.user.id);

                User.create({
                    name: "Arata Kagan",
                    email: "arata@gmail.com",
                    password: "testtesttest",
                    role: 0
                })
                .then((newUser) => {
                    this.collaboration.setUser(newUser)
                    .then((collaboration) => {
                        expect(collaboration.userId).toBe(newUser.id);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
        });
    });

    describe("#getUser()", () => {
        it("should return a associated user", (done) => {
            Collaboration.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collaboration) => {
                collaboration.getUser()
                .then((user) => {
                    expect(user.id).toBe(this.user.id);
                    done();
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

});