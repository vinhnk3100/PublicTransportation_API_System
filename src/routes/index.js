// Import Routers
const apiRouter = require("./api.routes")

const routes = app => {
    // =============== Auth Section ===============
    app.use('/api', apiRouter)

    // Handle error nếu không decode được params
    app.get('*', (req, res) => {
        return res.status(404).end("API Not Found");
    });

    app.use((err, req, res, next) => {
        try {
            decodeURIComponent(req.path);
        } catch (e) {
            err = e;
        }
        if (err) {
            console.log('From index.routes: Error', err);
            return res.status(404).end("API Not Found");
        }
        next();
    });
}

module.exports = routes;