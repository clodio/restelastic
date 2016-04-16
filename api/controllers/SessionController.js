module.exports = {
    disable: function(req, res, next) {
        req.session = null;
        next();
    }
};
