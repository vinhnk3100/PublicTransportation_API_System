// Import Routers
const apiRouter = require("./api.routes")

// Import Model
const User = require('../models/User.model');

const routes = app => {
    // =============== Auth Section ===============
    app.use('/api', apiRouter)

    // Handle error nếu không decode được params
    app.get('*', (req, res) => {
        res.status(404).render('error');
    });

    app.use((err, req, res, next) => {
        try {
            decodeURIComponent(req.path);
        } catch (e) {
            err = e;
        }
        if (err) {
            console.log('From index.routes: Error', err);
            return res.redirect('/error');
        }
        next();
    });
}

module.exports = routes;