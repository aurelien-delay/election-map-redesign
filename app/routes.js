var path = require('path');
var connection = require('./connection.js');
var settingsDB = require('./settingsDB.js');

module.exports = function(app) {
    // --- redirect towards home page ---
    app.get('/carte-election-antibes', redirectHomePage);
    // --- read settings in DB ---
    app.get('/api/settings/:settingsName', readSettings);
};


// --- function linked to routes ---
function redirectHomePage (req, res)
{
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
}

function readSettings(req, res)
{
    // --- call DB request. they will take care to send back the reply when finished with input res ---
    var settingsName = req.params.settingsName;
    settingsDB.readSettings(connection, settingsName, res);
}
