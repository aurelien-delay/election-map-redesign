var Sequelize = require('sequelize');

// --- export the sequelize model ---
module.exports = {
    getVZResultModel: getVZResultModel
}

// --- define DB fields ---
var vzResultProperties = {
    // --- simple fields ---
    vz_result_id:   {type: Sequelize.STRING},
    vz_id:          {type: Sequelize.STRING},
    election_id:    {type: Sequelize.STRING},
    inscrits:       {type: Sequelize.INTEGER},
    votants:        {type: Sequelize.INTEGER},
    exprimes:       {type: Sequelize.INTEGER}
};

// --- Instantiate the new model with Sequelize ---
function getVZResultModel(sequelize)
{
    var VZResult = sequelize.define('vz_result', vzResultProperties);
    return VZResult;
}
