const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

    beforeEach((done) => {
        this.wiki;
        this.user;

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
                    private: false,
                    userId: this.user.id
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
                title: "Planets",
                body: "Earth, Jupitar, Mars"
            }
        };

        it("should create a new wiki and redirect", (done) => {
            console.log("before the post is created");
            request.post(options,
                (err, res, body) => {
                    Wiki.findOne({where: {title: "Planets"}})
                    .then((wiki) => {
                        expect(res.statusCode).toBe(303);
                        expect(wiki.title).toBe("Planets");
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
            request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Earth, Marse, Pluto");
                done();
            });
        });
    });


});