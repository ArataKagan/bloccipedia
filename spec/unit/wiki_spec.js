const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {
    beforeEach((done) => {
        this.user;
        this.wiki;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                name: "Arata Kagan",
                email: "starman@tesla.com",
                password: "Trekkie4life"
            })
            .then((user) => {
                this.user = user;
                Wiki.create({
                    title: "Food Wiki",
                    body: "World's unique foods",
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    console.log("wiki created");
                    this.wiki = wiki;
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#create()", () => {
        it("should create a wiki object with a title, body, and assigned user", (done) => {
            Wiki.create({
                title: "Travel Wiki",
                body: "World's best places to visit",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                expect(wiki.title).toBe("Travel Wiki");
                expect(wiki.body).toBe("World's best places to visit");
                expect(wiki.userId).toBe(this.user.id)
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a wiki with missing title, body, assigned user", (done) => {
            Wiki.create({
                title: "Test Wiki"
            })
            .then((wiki) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Wiki.body cannot be null");
                expect(err.message).toContain("Wiki.userId cannot be null");
                done();
            })
        });
    });

    describe("#setUser()", () => {
        it("should associate a Wiki and a user together", (done) => {
            User.create({
                name: "Sean Kagan",
                email: "sean@example.com",
                password: "abcde"
            })
            .then((newUser) => {
                // expect(this.wiki.userId).toBe(this.user.id);
                this.wiki.setUser(newUser)
                .then((wiki) => {
                    expect(wiki.userId).toBe(newUser.id);
                    done();
                });
            })
        });
    });

    describe("#getUser()", () => {
        it("should return the associated user", (done) => {
            this.wiki.getUser()
            .then((associatedUser) => {
                expect(associatedUser.email).toBe("starman@tesla.com");
                done();
            });
        });
    });

    describe("#setWiki()", () => {
        it("should associate a wiki and user together", (done) => {
            Wiki.create({
                title: "Space travel",
                body: "The name of the planets",
                private: false,
                userId: this.user.id
            })
            .then((newWiki) => {
                // expect(this.wiki.userId).toBe(this.user.id);

                this.user.setWiki(newWiki)
                .then((wiki) => {
                    expect(wiki.userId).toBe(newWiki.id);
                    done();
                });
            });
        });
    });

    describe("#getWiki()", () => {
        it("should return the associated wiki", (done) => {
            this.user.getWiki()
            .then((associatedWiki) => {
                expect(associatedWiki.title).toBe("Food Wiki");
                done();
            });
        });
    });
});