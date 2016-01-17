var path = require('path');

module.exports = function(app) {
    app.get('*', redirectHomePage);
};

function redirectHomePage (req, res)
{
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
}
