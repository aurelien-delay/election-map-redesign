var Sequelize = require('sequelize');

// --- export the sequelize model ---
module.exports = {
    getVZResultModel: getVZResultModel,
    getVZResultCandModel: getVZResultCandModel
}

// --- define general result DB fields ---
var vzResultProperties = {
    // --- simple fields ---
    vz_result_id:   {type: Sequelize.STRING, primaryKey: true},
    vz_id:          {type: Sequelize.STRING},
    election_id:    {type: Sequelize.STRING},
    inscrits:       {type: Sequelize.INTEGER},
    votants:        {type: Sequelize.INTEGER},
    exprimes:       {type: Sequelize.INTEGER}
};

// --- define candidate result DB fields ---
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
function getVZResultModel(sequelize)
{
    var VZResult = sequelize.define('vz_result', vzResultProperties);
    var VZResultCand = sequelize.define('vz_result_candidate', vzResultCandProperties, vzResultCandGetSet);
    VZResultCand.hasOne(VZResult, {foreignKey: 'vz_result_id', constraints: false} );
    VZResult.hasMany(VZResultCand, {foreignKey: 'vz_result_id', constraints: false} );
    // VZResultCand.hasMany(VZResult, {foreignKey: 'vz_result_id', constraints: false} );
    // VZResult.hasOne(VZResultCand, {foreignKey: 'vz_result_id', constraints: false} );
    return [VZResult, VZResultCand];
}

function getVZResultCandModel(sequelize)
{
    // var VZResultCand = sequelize.define('vz_result_candidate', vzResultCandProperties, vzResultCandGetSet);
    // VZResultCand.hasOne(VZResult, {as: 'Results', foreignKey: 'vz_result_id'});
    // return VZResultCand;
}
