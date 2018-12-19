const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("#create()", () => {
        it("should create a User object with a valid email and password", (done) => {
            User.create({
                name: "test name",
                email: "user@example.com",
                password: "1234567890"
            })
            .then((user) => {
                expect(user.name).toBe("test name");
                expect(user.email).toBe("user@example.com");
                expect(user.id).toBe(1);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        // check to see if the email or password is valid
        it("should not create a user with invalid email or password", (done) => {
            User.create({
                name: "oliver test",
                email: "oliver, love!",
                password: "123456789"
            })
            .then((user) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Validation error: must be a valid email");
                done();
            });
        });

        it("should not create a user with an email already taken", (done) => {
            User.create({
                name: "test name",
                email: "user@example.com",
                password: "1234567890"
            })
            .then((user) => {
                User.create({
                    name: "arata test",
                    email: "user@example.com",
                    password: "arataarataarata"
                })
                .then((user) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Validation error");
                    done();
                });

                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });
});