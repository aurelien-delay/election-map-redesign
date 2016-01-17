// set up ======================================================================
var connection = require("../../app/connection.js");

var settingsToInsert = require("./settingsToInsert.json");

console.log("settings to insert", settingsToInsert);
connection.settings.create(settingsToInsert).then(itisdone);

function itisdone() { console.log("insert finished"); }
