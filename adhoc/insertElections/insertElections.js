
var connection = require("../../app/connection.js");

var electionsToInsert = require("./electionsToInsert.json");

console.log("elections to insert", electionsToInsert);

for ( index in electionsToInsert["elections"] )
{
    console.log("election to insert", electionsToInsert["elections"][index]);
    connection.election.create(electionsToInsert["elections"][index]).then(itisdone);
    function itisdone() { console.log("insert #" + index + " finished"); }
}

function itisdone() { console.log("insert finished"); }
