const loginLogout = require('../routes/loginLogout')
module.exports = function (app) {
    app.get("/", function (req, res, next) {
        res.send("Directory access is forbidden..");
    });

    loginLogout(app)
}