var Sequelize = require('sequelize');

// --- export the sequelize model ---
module.exports = {
    getVotingZoneModel: getVotingZoneModel
}

// --- define DB fields ---
var votingZoneProperties = {
    // --- simple fields ---
    vz_id:          {type: Sequelize.STRING},
    settingsName:   {type: Sequelize.STRING},

    // --- fields with JSON string ---
    _geojson:       {type: Sequelize.TEXT},
    geojson:        {type: Sequelize.TEXT}
};

// --- for fields set with JSON, define the way to get/set them ---
var votingZoneGetSet = {
    getterMethods: {
        geojson:  function(){ return this._geojson;  },
    },

    setterMethods: {
        geojson:  function(v){ this._geojson = JSON.stringify(v);  },
    }


};

// --- Instantiate the new model with Sequelize ---
function getVotingZoneModel(sequelize)
{
    var VotingZone = sequelize.define('votingZone', votingZoneProperties, votingZoneGetSet);
    return VotingZone;
}
