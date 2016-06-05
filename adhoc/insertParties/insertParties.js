
var connection = require("../../app/connection.js");

var partiesToInsert = require("./partiesToInsert.json");

console.log("parties to insert", partiesToInsert);

for ( index in partiesToInsert["parties"] )
{
    console.log("party to insert", partiesToInsert["parties"][index]);
    connection.party.create(partiesToInsert["parties"][index]).then(itisdone);
    function itisdone() { console.log("insert #" + index + " finished"); }
}

function itisdone() { console.log("insert finished"); }
