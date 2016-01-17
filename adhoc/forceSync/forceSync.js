var connection = require("../../app/connection.js");

connection.sequelize.sync({force: false}).then(function(){console.log("sync finished");});
