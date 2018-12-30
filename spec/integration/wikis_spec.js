const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

    beforeEach((done) => {
        this.wiki;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                name: "Arata Kagan",
                email: "arata@test.com",
                password: "abcdef"
            })
            .then((user) => {
                this.user = user;
                Wiki.create({
                    title: "The Name of Planet",
                    body: "Earth, Marse, Pluto",
                    private: false
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                });
            });
        });
    });

    describe("GET /wikis", () => {
        it("should return a status code 200 and return all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Wikis");
                expect(body).toContain("The Name of Planet");
                done();
            });
        });
    });

    describe("GET /wikis/new", () => {
        it("should render a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
            });
        });
    });

    describe("POST /wikis/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "Planets Series",
                body: "Earth, Jupitar, Mars"
            }
        };

        it("should create a new wiki and redirect", (done) => {
            console.log("before the post is created");
            request.post(options,
                (err, res, body) => {
                    Wiki.findOne({where: {title: "Planets Series"}})
                    .then((wiki) => {
                        expect(res.statusCode).toBe(303);
                        expect(wiki.title).toBe("Planets Series");
                        expect(wiki.body).toBe("Earth, Jupitar, Mars");
                        console.log("wiki was found and matched")
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                })
        })
    });

    describe("GET /wikis/:id", () => {
        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Earth, Marse, Pluto");
                done();
            });
        });
    });

    describe("POST /wikis/:id/destroy", () => {
        it("should delete the wiki with the associated ID", (done) => {
            expect(this.wiki.id).toBe(1);
            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                Wiki.findById(1)
                .then((wiki) => {
                    expect(err).toBeNull();
                    expect(wiki).toBeNull();
                    done();
                })
            });
        });
    });

    describe("GET /wikis/:id/edit", () => {
        it("should render a view with an edit wiki form", (done) => {
            request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("The Name of Planet");
                done();
            });
        });
    });

    describe("POST /wikis/:id/update", () => {
        it("should update the wiki with the given value", (done) => {
            const options = {
                url: `${base}${this.wiki.id}/update`,
                form: {
                    title: "Amusement parks around the world",
                    body: "Disney land, univeral studio"
                }
            };

            request.post(options, (err, res, body) => {
                expect(err).toBeNull();
                Wiki.findOne({
                    where: { id: this.wiki.id }
                })
                .then((wiki) => {
                    expect(wiki.title).toBe("Amusement parks around the world");
                    done();
                });
            });
        });
    });


});