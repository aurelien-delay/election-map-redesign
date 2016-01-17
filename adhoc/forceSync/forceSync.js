var connection = require("../../app/connection.js");

connection.sequelize.sync({force: true}).then(function(){console.log("sync finished");});
