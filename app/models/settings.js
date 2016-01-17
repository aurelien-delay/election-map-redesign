var Sequelize = require('sequelize');

// --- export the sequelize model ---
module.exports = {
    getSettingsModel: getSettingsModel
}

// --- define DB fields ---
var settingsProperties = {
    // --- simple fields ---
    settingsName:                   {type: Sequelize.STRING},
    defaultElection:                {type: Sequelize.STRING},
    defaultParty:                   {type: Sequelize.STRING},
    defaultMaxScore:                {type: Sequelize.INTEGER},
    zoom:                           {type: Sequelize.INTEGER},
    opacity:                        {type: Sequelize.FLOAT},
    emptyColor:                     {type: Sequelize.STRING},
    center_lat:                     {type: Sequelize.FLOAT},
    center_lng:                     {type: Sequelize.FLOAT},
    abstentionColor:                {type: Sequelize.STRING},
    markAbstentionThreshold:        {type: Sequelize.STRING},

    // --- fields with JSON string ---
    _elections:     {type: Sequelize.TEXT},
    elections:      {type: Sequelize.TEXT},
    _partyOrder:    {type: Sequelize.TEXT},
    partyOrder:     {type: Sequelize.TEXT}
};

// --- for fields set with JSON, define the way to get/set them ---
var settingsGetSet = {
    getterMethods: {
        elections:  function(){ return JSON.parse(this._elections);  },
        partyOrder: function(){ return JSON.parse(this._partyOrder); }
    },

    setterMethods: {
        elections:  function(v){ this._elections = JSON.stringify(v);  },
        partyOrder: function(v){ this._partyOrder = JSON.stringify(v); },
    }


};

// --- Instantiate the new model with Sequelize ---
function getSettingsModel(sequelize)
{
    var Settings = sequelize.define('settings', settingsProperties, settingsGetSet);
    return Settings;
}
