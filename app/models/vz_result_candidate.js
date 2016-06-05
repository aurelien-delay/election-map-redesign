var Sequelize = require('sequelize');

// --- export the sequelize model ---
module.exports = {
    getVZResultCandModel: getVZResultCandModel
}

// --- define DB fields ---
var vzResultCandProperties = {
    // --- simple fields ---
    vz_result_id:   {type: Sequelize.STRING},
    freetext:       {type: Sequelize.STRING},
    voix:           {type: Sequelize.INTEGER},

    // --- fields with JSON string ---
    _party_labels:     {type: Sequelize.TEXT},
    party_labels:      {type: Sequelize.TEXT},
};

// --- for fields set with JSON, define the way to get/set them ---
var vzResultCandGetSet = {
    getterMethods: {
        party_labels:  function(){ return JSON.parse(this._party_labels);  }
    },

    setterMethods: {
        party_labels:  function(v){ this._party_labels = JSON.stringify(v);  }
    }
};

// --- Instantiate the new model with Sequelize ---
function getVZResultCandModel(sequelize)
{
    var VZResultCand = sequelize.define('vz_result_candidate', vzResultCandProperties, vzResultCandGetSet);
    return VZResultCand;
}
