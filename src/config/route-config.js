module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const wikiRoutes = require("../routes/wikis");
        const userRoutes = require("../routes/users");
        const collaborationRoutes = require("../routes/collaborations")
        
        app.use(staticRoutes);
        app.use(wikiRoutes);
        app.use(userRoutes);
        app.use(collaborationRoutes);
    }
}