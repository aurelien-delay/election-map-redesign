var Sequelize = require('sequelize');

// --- export the sequelize model ---
module.exports = {
    getElectionModel: getElectionModel
}

// --- define DB fields ---
var electionProperties = {
    // --- simple fields ---
    settingsName:           {type: Sequelize.STRING},
    election_id:            {type: Sequelize.STRING},
    electionFullName:       {type: Sequelize.STRING},
    electionShortName:      {type: Sequelize.STRING}
};

// --- Instantiate the new model with Sequelize ---
function getElectionModel(sequelize)
{
    var Election = sequelize.define('election', electionProperties);
    return Election;
}
