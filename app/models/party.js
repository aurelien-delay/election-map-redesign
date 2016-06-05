var Sequelize = require('sequelize');

// --- export the sequelize model ---
module.exports = {
    getPartyModel: getPartyModel
}

// --- define DB fields ---
var partyProperties = {
    // --- simple fields ---
    label:          {type: Sequelize.STRING},
    color:          {type: Sequelize.STRING}
};

// --- Instantiate the new model with Sequelize ---
function getPartyModel(sequelize)
{
    var Party = sequelize.define('party', partyProperties);
    return Party;
}
