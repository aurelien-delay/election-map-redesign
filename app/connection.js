// --- import libraries + DB config ---
// NOTE : for security reason, config file is not committed in version control system.
// It's a json file containing keys host, user, database and password
var config;
if ( process.env.NODE_ENV === "production" )        config = require('./sql_connection.json');
else                                                config = require('./sql_connection_dev.json');
var Sequelize = require('sequelize');
var SettingsModel = require('./models/settings.js');
var VotingZoneModel = require('./models/votingZone.js');


// --- set the connection and others optons in a central sequelize object ---
var sequelize = new Sequelize(config.database, config.user, config.password, config);

// --- define all the models ---
var settings = SettingsModel.getSettingsModel(sequelize);
var votingZone = VotingZoneModel.getVotingZoneModel(sequelize);

// sequelize.sync().then(function(){console.log("sync finished");});

// --- export the sequelize object with all the options, and all the defined models ---
module.exports = {
    sequelize: sequelize,
    settings: settings,
    votingZone: votingZone
}
