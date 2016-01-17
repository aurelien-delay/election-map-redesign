var path = require('path');
var connection = require('./connection.js');
var settingsDB = require('./settingsDB.js');
var votingZoneDB = require('./votingZoneDB.js');

module.exports = function(app) {
    // --- redirect towards home page ---
    app.get('/carte-election-antibes', redirectHomePage);
    // --- read settings in DB ---
    app.get('/api/settings/:settingsName', readSettings);
    // --- read voting zones in DB, matching input settings name ---
    app.get('/api/votingzonesid/:settingsName', readVotingZonesID);
    // --- read one voting zone in DB, matching input ID ---
    app.get('/api/votingzone/:vz_id', readVotingZone);
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

function readVotingZonesID(req, res)
{
    // --- call DB request. they will take care to send back the reply when finished with input res ---
    var settingsName = req.params.settingsName;
    votingZoneDB.readVotingZonesID(connection, settingsName, res);
}

function readVotingZone(req, res)
{
    // --- call DB request. they will take care to send back the reply when finished with input res ---
    var vz_id = req.params.vz_id;
    votingZoneDB.readOneVotingZone(connection, vz_id, res);
}
