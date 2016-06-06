var path = require('path');
var connection = require('./connection.js');
var settingsDB = require('./settingsDB.js');
var electionsDB = require('./electionsDB.js');
var partiesDB = require('./partyDB.js');
var resultsDB = require('./resultsDB.js');
var votingZoneDB = require('./votingZoneDB.js');

module.exports = function(app) {
    // --- redirect towards home page ---
    app.get('/carte-election-antibes', redirectHomePage);
    // --- read settings in DB ---
    app.get('/api/settings/:settingsName', readSettings);
    // --- read elections in DB attached to a settings ---
    app.get('/api/elections/:settingsName', readElections);
    // --- read elections in DB attached to a settings ---
    app.get('/api/parties/', readParties);
    // --- read voting zones in DB, matching input settings name ---
    app.get('/api/votingzonesid/:settingsName', readVotingZonesID);
    // --- read one voting zone in DB, matching input ID ---
    app.get('/api/votingzone/:vz_id', readVotingZone);
    // --- read the results (general and all candidates) for one voting zone and one election ---
    app.get('/api/results/:election_id', readElectionResults);
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

function readElections(req, res)
{
    // --- call DB request. they will take care to send back the reply when finished with input res ---
    var settingsName = req.params.settingsName;
    electionsDB.readElections(connection, settingsName, res);
}

function readParties(req, res)
{
    // --- call DB request. they will take care to send back the reply when finished with input res ---
    partiesDB.readParties(connection, res);
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

function readElectionResults(req, res)
{
    // --- call DB request. they will take care to send back the reply when finished with input res ---
    var election_id = req.params.election_id;
    resultsDB.readElectionResults(connection, election_id, res);
}
