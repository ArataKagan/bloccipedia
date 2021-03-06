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
            Wiki.create({
                title: "List of countries around the world",
                body: "USA, Japan, Canada, UK",
                private: false
            })
            .then((wiki) => {
                this.wiki = wiki;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    free member user context 
    describe("Free member performing CRUD actions for wiki", () => {
        beforeEach((done) => {
            this.wiki;
            this.user;
    
            sequelize.sync({force: true}).then((res) => {
                User.create({
                    name: "Arata Kagan",
                    email: "arata@test.com",
                    password: "abcdef",
                    role: 0 //free member
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
                request.post(options,
                    (err, res, body) => {
                        Wiki.findOne({where: {title: "Planets Series"}})
                        .then((wiki) => {
                            expect(res.statusCode).toBe(303);
                            expect(wiki.title).toBe("Planets Series");
                            expect(wiki.body).toBe("Earth, Jupitar, Mars");
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

    // admin context
    describe("Admin user performing CRUD actions for wiki", () => {
        beforeEach((done) => {
            this.wiki;
            this.user;
            
            sequelize.sync({force: true}).then((res) => {
                User.create({
                    name: "Test Kagan",
                    email: "test@test.com",
                    password: "testtest02",
                    role: 0 //standard user
                })
                .then((user) => {
                    this.user = user;
                    Wiki.create({
                        title: "Religion in the world",
                        body: "Buddhism, Catlic, Hindhu",
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

        describe("Admin user delete wiki created by other user", () => {
            this.user;
            User.create({
                name: "Random Kagan",
                email: "random@test.com",
                password: "abcdefgh",
                role: 2 // admin user
            })
            .then((user) => {
                this.user = user;
                describe("GET /wikis/:id", () => {
                    it("should render a view with the selected wiki", (done) => {
                        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                            expect(err).toBeNull();
                            expect(body).toContain("Buddhism, Catlic, Hindhu");
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
                            expect(body).toContain("Buddhism, Catlic, Hindhu");
                            done();
                        });
                    });
                });
            
                describe("POST /wikis/:id/update", () => {
                    it("should update the wiki with the given value", (done) => {
                        const options = {
                            url: `${base}${this.wiki.id}/update`,
                            form: {
                                title: "Religion in the world",
                                body: "Buddhism, Catlic, Hindhu, Islam"
                            }
                        };
            
                        request.post(options, (err, res, body) => {
                            expect(err).toBeNull();
                            Wiki.findOne({
                                where: { id: this.wiki.id }
                            })
                            .then((wiki) => {
                                expect(wiki.body).toBe("Buddhism, Catlic, Hindhu, Islam");
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});